import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../_shared/stripe.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const PLAN_LIMITS: Record<string, number> = {
  BASE: 20,
  PRO: 60,
  PRO_PLUS: 120,
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  console.log(`Processing event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id
        const metadata = session.metadata || {}

        if (!userId) {
          console.error('No user_id found in session')
          break
        }

        if (session.mode === 'payment' && metadata.type === 'extra') {
          // One-time payment for extra credits
          const creditsToAdd = Number(metadata.credits || 20)

          // Increment extra credits using RPC
          const { error: rpcError } = await supabase.rpc(
            'increment_extra_credits',
            {
              user_uuid: userId,
              amount: creditsToAdd,
            },
          )

          if (rpcError) {
            console.error('Failed to increment credits via RPC', rpcError)
            throw rpcError
          }

          // Record payment
          await supabase.from('payments').insert({
            user_id: userId,
            type: 'extra',
            amount: session.amount_total || 0,
            status: 'completed',
            gateway_payment_id: session.payment_intent as string,
          })
        } else if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string
          const plan = metadata.plan as string

          if (plan && PLAN_LIMITS[plan]) {
            const subscription =
              await stripe.subscriptions.retrieve(subscriptionId)

            await supabase.from('subscriptions').upsert(
              {
                user_id: userId,
                plan: plan,
                status: subscription.status,
                gateway_subscription_id: subscriptionId,
                current_period_start: new Date(
                  subscription.current_period_start * 1000,
                ).toISOString(),
                current_period_end: new Date(
                  subscription.current_period_end * 1000,
                ).toISOString(),
              },
              { onConflict: 'gateway_subscription_id' },
            )

            // Set initial credits
            await supabase.from('proposal_credits').upsert(
              {
                user_id: userId,
                monthly_limit: PLAN_LIMITS[plan],
                monthly_used: 0,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' },
            )
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('user_id, plan')
          .eq('gateway_subscription_id', subscriptionId)
          .single()

        if (subError || !subData) {
          console.error('Subscription not found for invoice', subscriptionId)
          break
        }

        const userId = subData.user_id
        const plan = subData.plan

        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId)

        await supabase
          .from('subscriptions')
          .update({
            status: stripeSub.status,
            current_period_start: new Date(
              stripeSub.current_period_start * 1000,
            ).toISOString(),
            current_period_end: new Date(
              stripeSub.current_period_end * 1000,
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('gateway_subscription_id', subscriptionId)

        // Reset monthly usage and ensure limit is correct upon renewal
        if (PLAN_LIMITS[plan]) {
          await supabase
            .from('proposal_credits')
            .update({
              monthly_limit: PLAN_LIMITS[plan],
              monthly_used: 0,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
        }

        await supabase.from('payments').insert({
          user_id: userId,
          type: 'subscription',
          amount: invoice.amount_paid,
          status: 'completed',
          gateway_payment_id: (invoice.payment_intent as string) || invoice.id,
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('gateway_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const subscriptionId = invoice.subscription as string
        if (subscriptionId) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('gateway_subscription_id', subscriptionId)
        }
        break
      }
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(`Error processing webhook: ${error.message}`, {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
