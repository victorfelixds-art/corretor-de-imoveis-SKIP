import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const GAMMA_API_URL =
  Deno.env.get('GAMMA_API_URL') ||
  'https://api.gamma.app/v1/generated_documents'
const GAMMA_API_KEY = Deno.env.get('GAMMA_API_KEY')

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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 1. Authenticate User
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { proposal_id } = await req.json()
    if (!proposal_id) throw new Error('Proposal ID is required')

    // 2. Fetch Data (Proposal, Property, Profile)
    const { data: proposal, error: proposalError } = await supabaseClient
      .from('proposals')
      .select('*, property:properties(*)')
      .eq('id', proposal_id)
      .single()

    if (proposalError || !proposal) throw new Error('Proposal not found')

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) throw new Error('Profile not found')

    // Enforce Active Layout (Business Logic)
    // Always use profile.active_layout_id if set, otherwise fallback to proposal's (if valid), otherwise default
    const enforcedLayoutId =
      profile.active_layout_id || proposal.layout_id || 'layout-base-1'

    // Fetch Global Settings
    const { data: settings } = await supabaseAdmin
      .from('admin_settings')
      .select('*')

    const settingMap = (settings || []).reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value
      return acc
    }, {})

    // Fetch Layout
    const { data: layout } = await supabaseAdmin
      .from('layouts')
      .select('*')
      .eq('id', enforcedLayoutId)
      .single()

    if (!layout) throw new Error('Layout not found')

    // 3. Consume Credit (Transactional Start)
    const { data: creditType, error: creditError } =
      await supabaseClient.rpc('consume_credit')
    if (creditError) {
      // Map postgres error to user friendly message
      if (creditError.message.includes('Insufficient credits')) {
        throw new Error(
          'Você não possui créditos suficientes. Adquira um pacote para continuar.',
        )
      }
      throw new Error(`Credit error: ${creditError.message}`)
    }

    let pdfUrl = ''

    try {
      // 4. Prepare Gamma Payload
      const features = proposal.property.features as {
        defaults: string[]
        custom: string[]
      }
      const allFeatures = [
        ...(features.defaults || []),
        ...(features.custom || []),
      ]
      const paymentConditions = proposal.payment_conditions as string[]
      const images = proposal.property.images || []

      // Calculate validity (7 days from created_at)
      const validityDate = new Date(
        proposal.created_at || new Date().toISOString(),
      )
      validityDate.setDate(validityDate.getDate() + 7)
      const validityStr = validityDate.toLocaleDateString('pt-BR')

      // Create links for PDF actions - UPDATED for new Tracking Route
      const appUrl =
        req.headers.get('origin') ||
        'https://pdfcorretor-foundation-e5997.goskip.app'
      const acceptLink = `${appUrl}/r/aceitar/${proposal.id}`
      const adjustmentsLink = `${appUrl}/r/ajustes/${proposal.id}`

      const payload = {
        template_id: layout.gamma_template_id || 'default', // Use DB template ID
        data: {
          CORRETOR: {
            NOME: profile.name || 'Corretor',
            CRECI: profile.creci || '',
            TELEFONE: profile.phone || '',
            EMAIL: profile.email || '',
            FOTO:
              profile.avatar_url ||
              'https://img.usecurling.com/ppl/medium?gender=male',
          },
          CLIENTE: {
            NOME: proposal.client_name,
          },
          IMOVEL: {
            NOME: proposal.property.name,
            ENDERECO: proposal.property.address,
            METRAGEM: `${proposal.property.sq_meters} m²`,
            VALOR_BASE: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(proposal.property.price),
            IMAGEM1:
              images[0] || 'https://img.usecurling.com/p/600/400?q=house',
            IMAGEM2:
              images[1] ||
              'https://img.usecurling.com/p/600/400?q=living%20room',
            IMAGEM3:
              images[2] || 'https://img.usecurling.com/p/600/400?q=kitchen',
          },
          PROPOSTA: {
            VALOR_ORIGINAL: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(proposal.final_price + (proposal.discount || 0)),
            VALOR_DESCONTO: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(proposal.discount || 0),
            ECONOMIA: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(proposal.discount || 0),
            VALOR_FINAL: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(proposal.final_price),
            UNIDADE: proposal.unit || '-',
            VALIDADE: validityStr,
            LINK_ACEITAR: acceptLink,
            LINK_AJUSTES: adjustmentsLink,
          },
          ITENS: {
            ITEM1: allFeatures[0] || '',
            ITEM2: allFeatures[1] || '',
            ITEM3: allFeatures[2] || '',
            ITEM4: allFeatures[3] || '',
            ITEM5: allFeatures[4] || '',
            ITEM6: allFeatures[5] || '',
          },
          PAGAMENTO: {
            PAGAMENTO1: paymentConditions[0] || '',
            PAGAMENTO2: paymentConditions[1] || '',
            PAGAMENTO3: paymentConditions[2] || '',
            PAGAMENTO4: paymentConditions[3] || '',
            PAGAMENTO5: paymentConditions[4] || '',
            PAGAMENTO6: paymentConditions[5] || '',
          },
          CONFIG: {
            MSG_ACCEPT: settingMap['msg_accept'] || 'Aceitar',
            MSG_ADJUST: settingMap['msg_adjust'] || 'Ajustar',
          },
        },
      }

      // 5. Call Gamma API (or Mock if key is missing)
      let finalPdfUrl = ''

      if (GAMMA_API_KEY) {
        console.log('Generating PDF via Gamma API...')
        const response = await fetch(GAMMA_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GAMMA_API_KEY}`,
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(
            `Gamma API Error: ${response.status} ${response.statusText} - ${errorText}`,
          )
        }

        const data = await response.json()
        finalPdfUrl = data.pdf_url
      } else {
        // Mock fallback for development without keys
        console.log('GAMMA_API_KEY not found. Using Mock PDF Generation.')
        await new Promise((resolve) => setTimeout(resolve, 1500))
        finalPdfUrl =
          'https://placehold.co/600x800/EEE/31343C?text=Gamma+PDF+Simulated+(No+Key)'
      }

      pdfUrl = finalPdfUrl

      // 6. Update Proposal with PDF URL and Ensure Layout Consistency
      const { error: updateError } = await supabaseAdmin
        .from('proposals')
        .update({
          pdf_url: pdfUrl,
          status: 'Gerada',
          layout_id: enforcedLayoutId, // Enforce the layout used
        })
        .eq('id', proposal.id)

      if (updateError) throw updateError
    } catch (err) {
      // 7. Rollback Credit if Gamma Failed
      console.error('Generation Failed, refunding credit:', err)
      await supabaseAdmin.rpc('refund_credit', {
        p_user_id: user.id,
        p_credit_type: creditType,
      })
      throw err
    }

    return new Response(JSON.stringify({ pdf_url: pdfUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
