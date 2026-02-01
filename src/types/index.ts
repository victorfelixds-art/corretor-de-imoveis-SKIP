export type Role = 'admin' | 'corretor'

export interface Profile {
  id: string
  name: string
  email: string
  role: Role
  created_at: string
  updated_at: string
}

export type SubscriptionPlan = 'BASE' | 'PRO' | 'PRO_PLUS'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled'

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  gateway_subscription_id: string
}

export interface ProposalCredits {
  user_id: string
  monthly_limit: number
  monthly_used: number
  extra_available: number
  updated_at: string
}

export type PaymentType = 'subscription' | 'extra'
export type PaymentStatus = 'pending' | 'completed' | 'failed'

export interface Payment {
  id: string
  user_id: string
  type: PaymentType
  amount: number
  status: PaymentStatus
  gateway_payment_id: string
}

export interface Layout {
  id: string
  name: string
  is_pro: boolean
  preview_url: string
  active: boolean
}
