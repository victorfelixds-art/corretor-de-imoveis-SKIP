import { Payment, Subscription } from '@/types'

export const paymentService = {
  createSubscription: async (
    userId: string,
    plan: string,
  ): Promise<Subscription> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `sub-${Date.now()}`,
          user_id: userId,
          plan: plan as any,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          gateway_subscription_id: `gw-${Date.now()}`,
        })
      }, 1000)
    })
  },

  buyCredits: async (
    userId: string,
    amount: number,
    cost: number,
  ): Promise<Payment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `pay-${Date.now()}`,
          user_id: userId,
          type: 'extra',
          amount: cost,
          status: 'completed',
          gateway_payment_id: `gw-pay-${Date.now()}`,
        })
      }, 1000)
    })
  },

  handleWebhook: async (payload: any): Promise<boolean> => {
    console.log('Webhook received', payload)
    return true
  },
}
