import { ProposalCredits } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const creditsService = {
  getUserCredits: async (userId: string): Promise<ProposalCredits | null> => {
    const { data, error } = await supabase
      .from('proposal_credits')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found, return a default structure (safe fallback)
        return {
          user_id: userId,
          monthly_limit: 0,
          monthly_used: 0,
          extra_available: 0,
          updated_at: new Date().toISOString(),
        }
      }
      throw error
    }
    return data
  },

  canConsumeProposal: async (userId: string): Promise<boolean> => {
    const credits = await creditsService.getUserCredits(userId)
    if (!credits) return false

    const monthlyRemaining = Math.max(
      0,
      credits.monthly_limit - credits.monthly_used,
    )
    return monthlyRemaining > 0 || credits.extra_available > 0
  },

  consumeProposal: async (): Promise<{
    type: 'monthly' | 'extra'
    balance: ProposalCredits
  }> => {
    // 1. Call RPC to consume credit atomically
    const { data: creditType, error } = await supabase.rpc('consume_credit')

    if (error) {
      console.error('Error consuming credit:', error)
      throw new Error(error.message || 'Failed to consume credit')
    }

    // 2. Fetch updated balance to return
    // We get the user ID from the session to ensure we fetch the right data
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const balance = await creditsService.getUserCredits(user.id)
    if (!balance) throw new Error('Failed to fetch updated balance')

    return {
      type: creditType as 'monthly' | 'extra',
      balance,
    }
  },
}
