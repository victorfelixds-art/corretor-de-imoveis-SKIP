import { Layout } from '@/types'
import { supabase } from '@/lib/supabase/client'

export const AVAILABLE_LAYOUTS: Layout[] = [
  {
    id: 'layout-base-1',
    name: 'Layout Clássico',
    is_pro: false,
    preview_url:
      'https://img.usecurling.com/p/300/400?q=document%20minimal&color=blue',
    description: 'Um layout limpo e direto para propostas rápidas.',
  },
  {
    id: 'layout-base-2',
    name: 'Layout Moderno',
    is_pro: false,
    preview_url:
      'https://img.usecurling.com/p/300/400?q=document%20modern&color=gray',
    description: 'Estilo contemporâneo com foco em tipografia.',
  },
  {
    id: 'layout-pro-1',
    name: 'Layout Premium Gold',
    is_pro: true,
    preview_url:
      'https://img.usecurling.com/p/300/400?q=luxury%20document&color=yellow',
    description: 'Acabamento sofisticado para imóveis de alto padrão.',
  },
  {
    id: 'layout-pro-2',
    name: 'Layout Dark Mode',
    is_pro: true,
    preview_url:
      'https://img.usecurling.com/p/300/400?q=dark%20ui%20document&color=black',
    description: 'Visual impactante com fundo escuro.',
  },
]

export const layoutsService = {
  getLayouts: () => AVAILABLE_LAYOUTS,

  setActiveLayout: async (userId: string, layoutId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ active_layout_id: layoutId })
      .eq('id', userId)

    if (error) throw error
  },
}
