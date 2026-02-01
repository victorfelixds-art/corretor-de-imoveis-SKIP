import { Property } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const propertiesService = {
  list: async (userId: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Property[]
  },

  count: async (userId: string) => {
    const { count, error } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) throw error
    return count || 0
  },

  create: async (property: Omit<Property, 'id' | 'created_at' | 'user_id'>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')

    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...property,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data as Property
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Property
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) throw error
  },
}
