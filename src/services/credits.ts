import { ProposalCredits } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const creditsService = {
  getCredits: async (userId: string): Promise<ProposalCredits | null> => {
    const { data, error } = await supabase
      .from('proposal_credits')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found, could try to initialize or return default
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

  checkCreditAvailability: async (userId: string): Promise<boolean> => {
    const credits = await creditsService.getCredits(userId)
    if (!credits) return false

    const monthlyRemaining = Math.max(
      0,
      credits.monthly_limit - credits.monthly_used,
    )
    return monthlyRemaining + credits.extra_available > 0
  },
}
