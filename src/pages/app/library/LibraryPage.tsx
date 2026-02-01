import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { layoutsService, AVAILABLE_LAYOUTS } from '@/services/layouts'
import { Layout } from '@/types'
import useAuthStore from '@/stores/useAuthStore'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LibraryPage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [layouts] = useState<Layout[]>(AVAILABLE_LAYOUTS)
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(
    user?.active_layout_id || null,
  )

  const handleSetActive = async (layoutId: string) => {
    try {
      if (user) {
        await layoutsService.setActiveLayout(user.id, layoutId)
        setActiveLayoutId(layoutId)
        toast({ title: 'Layout ativo atualizado!' })
      }
    } catch (error) {
      toast({ title: 'Erro ao atualizar layout', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Biblioteca de Layouts
        </h1>
        <p className="text-muted-foreground">
          Escolha o visual das suas propostas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {layouts.map((layout) => (
          <Card key={layout.id} className="overflow-hidden flex flex-col">
            <div className="aspect-[3/4] bg-muted relative">
              <img
                src={layout.preview_url}
                alt={layout.name}
                className="w-full h-full object-cover"
              />
              {layout.is_pro && (
                <Badge className="absolute top-2 right-2 bg-yellow-500">
                  PRO+
                </Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{layout.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {layout.description}
              </p>
            </CardContent>
            <CardFooter>
              {activeLayoutId === layout.id ? (
                <Button className="w-full" disabled variant="secondary">
                  <Check className="mr-2 h-4 w-4" /> Layout Ativo
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={layout.is_pro ? 'outline' : 'default'}
                  onClick={() => {
                    if (layout.is_pro) {
                      toast({
                        title: 'Upgrade necessário',
                        description: 'Layout exclusivo para assinantes PRO+.',
                        variant: 'destructive',
                      })
                    } else {
                      handleSetActive(layout.id)
                    }
                  }}
                >
                  {layout.is_pro ? 'Upgrade para Usar' : 'Definir como Ativo'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
