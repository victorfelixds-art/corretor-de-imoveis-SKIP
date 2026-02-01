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
import { Check, Star, AlertTriangle, Layout as LayoutIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function LibraryPage() {
  const { user, refreshProfile } = useAuthStore()
  const { toast } = useToast()
  const [layouts] = useState<Layout[]>(AVAILABLE_LAYOUTS)
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(
    user?.active_layout_id || null,
  )

  useEffect(() => {
    if (user?.active_layout_id) {
      setActiveLayoutId(user.active_layout_id)
    }
  }, [user])

  const handleSetActive = async (layoutId: string) => {
    try {
      if (user) {
        await layoutsService.setActiveLayout(user.id, layoutId)
        setActiveLayoutId(layoutId)
        await refreshProfile()
        toast({ title: 'Layout ativo atualizado!' })
      }
    } catch (error) {
      toast({ title: 'Erro ao atualizar layout', variant: 'destructive' })
    }
  }

  const hasActiveLayout = !!activeLayoutId

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Biblioteca de Layouts
        </h1>
        <p className="text-secondary mt-1">
          Escolha o visual profissional das suas propostas.
        </p>
      </div>

      {!hasActiveLayout && (
        <Alert
          variant="default"
          className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-500 font-semibold">
            Escolha um layout para suas propostas
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400 mt-1">
            O layout define a aparência do PDF que seus clientes vão receber.
            Você precisa selecionar um layout para começar a gerar propostas.
          </AlertDescription>
        </Alert>
      )}

      {hasActiveLayout && (
        <div className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg flex items-center gap-2">
          <LayoutIcon className="h-4 w-4" />
          Você pode trocar de layout quando quiser antes de gerar novas
          propostas.
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {layouts.map((layout) => (
          <Card
            key={layout.id}
            className="overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group border-border/60"
          >
            <div className="aspect-[3/4] bg-muted relative group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src={layout.preview_url}
                alt={layout.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {layout.is_pro && (
                <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 border-none shadow-lg text-white font-bold px-3 py-1">
                  <Star className="w-3 h-3 mr-1 fill-white" /> PRO+
                </Badge>
              )}
            </div>

            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-lg">{layout.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-5 pt-2">
              <p className="text-sm text-secondary leading-relaxed">
                {layout.description}
              </p>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              {activeLayoutId === layout.id ? (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  disabled
                >
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
