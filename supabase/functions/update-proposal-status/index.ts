import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { proposal_id, action } = await req.json()

    if (!proposal_id || !action) {
      throw new Error('Missing proposal_id or action')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 1. Validate Proposal
    const { data: proposal, error: proposalError } = await supabaseAdmin
      .from('proposals')
      .select('*, user_id')
      .eq('id', proposal_id)
      .single()

    if (proposalError || !proposal) {
      throw new Error('Link inválido ou proposta não encontrada')
    }

    // 2. Map Action to Status and Event Type
    let status = ''
    let eventType = ''
    let messageKey = ''

    if (action === 'aceitar' || action === 'accept') {
      status = 'Aceita'
      eventType = 'aceitar'
      messageKey = 'whatsapp_accept_message'
    } else if (action === 'ajustes' || action === 'request_changes') {
      status = 'Pediu ajustes'
      eventType = 'ajustes'
      messageKey = 'whatsapp_adjust_message'
    } else {
      throw new Error('Ação inválida')
    }

    // 3. Update Proposal Status
    const { error: updateError } = await supabaseAdmin
      .from('proposals')
      .update({ status })
      .eq('id', proposal_id)

    if (updateError) throw updateError

    // 4. Log Event
    await supabaseAdmin.from('proposal_events').insert({
      proposal_id,
      type: eventType,
    })

    // 5. Get Agent Profile (Phone)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('phone')
      .eq('id', proposal.user_id)
      .single()

    if (!profile?.phone) {
      // Fallback or Error? We can return success but no phone redirect
      console.warn('Agent has no phone')
    }

    // 6. Get Message Template
    const { data: setting } = await supabaseAdmin
      .from('admin_settings')
      .select('value')
      .eq('key', messageKey)
      .single()

    const template = setting?.value || `Olá, sobre a proposta ${proposal_id}...`
    const message = template.replace('{{PROPOSTA.ID}}', proposal_id.slice(0, 8))

    // 7. Construct WhatsApp URL
    // Sanitize phone (remove non-digits)
    const phone = (profile?.phone || '').replace(/\D/g, '')

    // Only redirect if we have a valid-looking phone number (at least 10 digits)
    const whatsappUrl =
      phone.length >= 10
        ? `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
        : null

    return new Response(
      JSON.stringify({
        success: true,
        whatsappUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
