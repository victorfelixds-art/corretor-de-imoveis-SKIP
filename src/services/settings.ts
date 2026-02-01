import { supabase } from '@/lib/supabase/client'
import { AdminSetting } from '@/types'

export const settingsService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('key')

    if (error) throw error
    return data as AdminSetting[]
  },

  update: async (key: string, value: string) => {
    const { error } = await supabase
      .from('admin_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)

    if (error) throw error
  },
}
