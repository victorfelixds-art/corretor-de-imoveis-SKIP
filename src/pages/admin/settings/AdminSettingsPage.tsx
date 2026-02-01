import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { settingsService } from '@/services/settings'
import { AdminSetting } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await settingsService.getAll()
      setSettings(data)
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao carregar configurações' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (key: string, value: string) => {
    // Optimistic update
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s)),
    )
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      await Promise.all(
        settings.map((s) => settingsService.update(s.key, s.value)),
      )
      toast({ title: 'Configurações salvas com sucesso' })
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground">
          Definições globais da plataforma.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geral</CardTitle>
          <CardDescription>
            Parâmetros usados na geração de PDF e mensagens.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <Label>{setting.label || setting.key}</Label>
              <Input
                value={setting.value}
                onChange={(e) => handleUpdate(setting.key, e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {setting.description}
              </p>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={saveAll} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
