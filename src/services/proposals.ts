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

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        ...proposal,
        user_id: user.id,
        status: 'Gerada',
        pdf_url: 'https://placehold.co/600x400/EEE/31343C?text=PDF+Preview', // Placeholder
      })
      .select()
      .single()

    if (error) throw error
    return data as Proposal
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
