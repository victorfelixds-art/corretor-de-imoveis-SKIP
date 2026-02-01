import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'
import { stripe } from '../_shared/stripe.ts'

const PLANS = {
  BASE: {
    name: 'Plano Base',
    price: 2990, // cents
    credits: 20,
    priceId: Deno.env.get('STRIPE_PRICE_ID_BASE') || 'price_base_mock',
  },
  PRO: {
    name: 'Plano Pro',
    price: 4990, // cents
    credits: 60,
    priceId: Deno.env.get('STRIPE_PRICE_ID_PRO') || 'price_pro_mock',
  },
  PRO_PLUS: {
    name: 'Plano Pro+',
    price: 7990, // cents
    credits: 120,
    priceId: Deno.env.get('STRIPE_PRICE_ID_PRO_PLUS') || 'price_pro_plus_mock',
  },
}

const EXTRA_PACK = {
  name: 'Pacote Extra',
  price: 2490, // cents
  credits: 20,
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      },
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { plan, type } = await req.json()
    const returnUrl = `${req.headers.get('origin')}/app/credits`

    let session
    if (type === 'subscription') {
      const planConfig = PLANS[plan as keyof typeof PLANS]
      if (!planConfig) throw new Error('Invalid plan')

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: planConfig.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${returnUrl}?canceled=true`,
        client_reference_id: user.id,
        metadata: {
          type: 'subscription',
          plan: plan,
          userId: user.id,
        },
        customer_email: user.email,
      })
    } else if (type === 'extra') {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: EXTRA_PACK.name,
                description: '20 Créditos de Proposta (Não expiram)',
              },
              unit_amount: EXTRA_PACK.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${returnUrl}?canceled=true`,
        client_reference_id: user.id,
        metadata: {
          type: 'extra',
          credits: EXTRA_PACK.credits,
          userId: user.id,
        },
        customer_email: user.email,
      })
    } else {
      throw new Error('Invalid type')
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
