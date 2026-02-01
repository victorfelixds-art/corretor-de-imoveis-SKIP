export type Role = 'admin' | 'corretor'

export interface Profile {
  id: string
  name: string | null
  email: string
  role: Role
  active_layout_id?: string
  creci?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type SubscriptionPlan = 'BASE' | 'PRO' | 'PRO_PLUS'
export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'unpaid'

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
  created_at?: string
}

export interface Layout {
  id: string
  name: string
  is_pro: boolean
  preview_url: string
  description?: string
}

export interface CreditUsageLog {
  id: string
  user_id: string
  credit_type: 'monthly' | 'extra'
  created_at: string
}

export interface Property {
  id: string
  user_id: string
  name: string
  price: number
  address: string
  sq_meters: number
  images: string[]
  features: {
    defaults: string[]
    custom: string[]
  }
  created_at: string
}

export type ProposalStatus = 'Gerada' | 'Pediu ajustes' | 'Aceita'

export interface Proposal {
  id: string
  user_id: string
  property_id: string
  client_name: string
  unit: string | null
  final_price: number
  discount: number
  payment_conditions: string[]
  layout_id: string
  status: ProposalStatus
  pdf_url: string | null
  created_at: string
  property?: Property
}
