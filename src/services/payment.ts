import { Payment, Subscription } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const paymentService = {
  createSubscriptionCheckout: async (
    plan: 'BASE' | 'PRO' | 'PRO_PLUS',
  ): Promise<{ url: string }> => {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        type: 'subscription',
        plan,
      },
    })

    if (error) throw error
    if (data.error) throw new Error(data.error)
    return data
  },

  createExtraCreditsCheckout: async (): Promise<{ url: string }> => {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        type: 'extra',
      },
    })

    if (error) throw error
    if (data.error) throw new Error(data.error)
    return data
  },

  getSubscription: async (userId: string): Promise<Subscription | null> => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  },

  getPaymentHistory: async (userId: string): Promise<Payment[]> => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Payment[]
  },
}
