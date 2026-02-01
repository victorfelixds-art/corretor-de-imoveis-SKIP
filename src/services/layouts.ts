import { Layout } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const layoutsService = {
  getLayouts: async () => {
    const { data, error } = await supabase
      .from('layouts')
      .select('*')
      .order('name')

    if (error) throw error

    // Map DB fields to UI expected fields
    return data.map((l: any) => ({
      ...l,
      is_pro: l.category !== 'BASE',
    })) as Layout[]
  },

  getActiveLayouts: async () => {
    const { data, error } = await supabase
      .from('layouts')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error

    return data.map((l: any) => ({
      ...l,
      is_pro: l.category !== 'BASE',
    })) as Layout[]
  },

  setActiveLayout: async (userId: string, layoutId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ active_layout_id: layoutId })
      .eq('id', userId)

    if (error) throw error
  },

  // Admin Methods
  createLayout: async (
    layout: Omit<Layout, 'id' | 'created_at' | 'is_pro'>,
  ) => {
    const { data, error } = await supabase
      .from('layouts')
      .insert({
        id: layout.id || `layout-${Date.now()}`,
        name: layout.name,
        description: layout.description,
        preview_url: layout.preview_url,
        category: layout.category,
        gamma_template_id: layout.gamma_template_id,
        is_active: layout.is_active,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  updateLayout: async (id: string, updates: Partial<Layout>) => {
    const { error } = await supabase
      .from('layouts')
      .update({
        name: updates.name,
        description: updates.description,
        preview_url: updates.preview_url,
        category: updates.category,
        gamma_template_id: updates.gamma_template_id,
        is_active: updates.is_active,
      })
      .eq('id', id)

    if (error) throw error
  },
}

// Fallback constant for types if needed elsewhere, but mostly deprecated
export const AVAILABLE_LAYOUTS: Layout[] = []
