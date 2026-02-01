import { supabase } from '@/lib/supabase/client'
import { AdminLog, Proposal, Profile, ProposalCredits } from '@/types'

export const adminService = {
  getDashboardStats: async () => {
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    const { count: activeUsersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true }) // Simplified, ideally filter by subscription active
    const { count: proposalsCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
    const { count: acceptedProposalsCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Aceita')

    // Sum credits (mocked aggregate as supabase-js simple client doesn't support SUM easy without RPC or fetch all)
    // We will use a simplified approach or RPC if needed. For now, fetch all credits and sum (careful with large DBs)
    const { data: creditsData } = await supabase
      .from('proposal_credits')
      .select('monthly_used')
    const totalCreditsUsed =
      creditsData?.reduce((acc, curr) => acc + curr.monthly_used, 0) || 0

    return {
      usersCount: usersCount || 0,
      activeUsersCount: activeUsersCount || 0, // In real app, check deleted_at if exists
      proposalsCount: proposalsCount || 0,
      acceptedProposalsCount: acceptedProposalsCount || 0,
      totalCreditsUsed,
    }
  },

  getUsers: async () => {
    // Join with credits and subscriptions
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        *,
        credits:proposal_credits(*),
        subscription:subscriptions(*)
      `,
      )
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  updateUserRole: async (userId: string, role: 'admin' | 'corretor') => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    if (error) throw error
    await adminService.logAction(
      'UPDATE_ROLE',
      `Changed user role to ${role}`,
      userId,
    )
  },

  adjustCredits: async (
    userId: string,
    monthlyDelta: number,
    extraDelta: number,
    reason: string,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Admin not authenticated')

    const { error } = await supabase.rpc('admin_adjust_credits', {
      p_user_id: userId,
      p_monthly_delta: monthlyDelta,
      p_extra_delta: extraDelta,
      p_admin_id: user.id,
      p_reason: reason,
    })

    if (error) throw error
  },

  logAction: async (
    actionType: string,
    description: string,
    targetId?: string,
    details?: any,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action_type: actionType,
      description,
      target_id: targetId,
      details,
    })
  },

  getAllProposals: async () => {
    const { data, error } = await supabase
      .from('proposals')
      .select('*, property:properties(name), profile:profiles(name)')
      .order('created_at', { ascending: false })
      .limit(100) // Limit for performance

    if (error) throw error
    return data
  },

  getLogs: async () => {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data as AdminLog[]
  },
}
