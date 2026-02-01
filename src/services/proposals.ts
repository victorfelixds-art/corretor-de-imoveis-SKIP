import { Proposal, ProposalStatus } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const proposalsService = {
  list: async (userId: string) => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*, property:properties(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Proposal[]
  },

  count: async (userId: string) => {
    const { count, error } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) throw error
    return count || 0
  },

  create: async (
    proposal: Omit<
      Proposal,
      'id' | 'created_at' | 'user_id' | 'status' | 'pdf_url'
    >,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')

    // 1. Create Draft Proposal (no PDF yet)
    const { data: draft, error: insertError } = await supabase
      .from('proposals')
      .insert({
        ...proposal,
        user_id: user.id,
        status: 'Gerada', // Initially "Gerada" but waiting for PDF
        pdf_url: null,
      })
      .select()
      .single()

    if (insertError) throw insertError

    // 2. Call Edge Function to Consume Credit & Generate PDF
    const { data: generationData, error: generationError } =
      await supabase.functions.invoke('generate-pdf', {
        body: { proposal_id: draft.id },
      })

    if (generationError) {
      // Clean up draft if generation failed (optional, but good for cleanliness)
      // await supabase.from('proposals').delete().eq('id', draft.id)

      // Map error to user friendly message if possible
      throw new Error(generationError.message || 'Erro na geração do PDF')
    }

    // Check for explicit error in data response
    if (generationData?.error) {
      throw new Error(generationData.error)
    }

    // 3. Return updated proposal
    return {
      ...draft,
      pdf_url: generationData.pdf_url,
    } as Proposal
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*, property:properties(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Proposal
  },

  updateStatus: async (id: string, status: ProposalStatus) => {
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', id)

    if (error) throw error
  },
}
