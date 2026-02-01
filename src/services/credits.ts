import { ProposalCredits } from '@/types'

export const creditsService = {
  getCredits: async (userId: string): Promise<ProposalCredits> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user_id: userId,
          monthly_limit: 10,
          monthly_used: 2,
          extra_available: 5,
          updated_at: new Date().toISOString(),
        })
      }, 600)
    })
  },

  checkCreditAvailability: async (userId: string): Promise<boolean> => {
    // Mock logic
    const credits = await creditsService.getCredits(userId)
    return (
      credits.monthly_limit - credits.monthly_used + credits.extra_available > 0
    )
  },
}
