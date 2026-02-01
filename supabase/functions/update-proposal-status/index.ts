import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { proposal_id, action } = await req.json()

    if (!proposal_id || !['accept', 'request_changes'].includes(action)) {
      throw new Error('Invalid parameters')
    }

    // Use Service Role to bypass RLS (since this is called by public client via proxy page)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 1. Fetch Proposal and Broker Info
    const { data: proposal, error: fetchError } = await supabaseAdmin
      .from('proposals')
      .select('*, property:properties(name), user:profiles(*)')
      .eq('id', proposal_id)
      .single()

    if (fetchError || !proposal) throw new Error('Proposal not found')

    // 2. Update Status
    const newStatus = action === 'accept' ? 'Aceita' : 'Pediu ajustes'

    // Only update if not already in a final state? User story allows updates.
    const { error: updateError } = await supabaseAdmin
      .from('proposals')
      .update({ status: newStatus })
      .eq('id', proposal_id)

    if (updateError) throw updateError

    // 3. Construct WhatsApp Message
    const brokerPhone = proposal.user?.phone || '5511999999999' // Fallback
    const propertyName = proposal.property?.name || 'Imóvel'

    let message = ''
    if (action === 'accept') {
      message = `Olá ${proposal.user?.name}, gostaria de aceitar a proposta do imóvel ${propertyName}. Podemos prosseguir?`
    } else {
      message = `Olá ${proposal.user?.name}, gostaria de solicitar ajustes na proposta do imóvel ${propertyName}.`
    }

    const whatsappUrl = `https://wa.me/${brokerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

    return new Response(JSON.stringify({ whatsappUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
