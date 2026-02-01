import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { layoutsService } from '@/services/layouts'
import { adminService } from '@/services/admin'
import { Layout } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Eye, Archive } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function AdminLayoutsPage() {
  const [layouts, setLayouts] = useState<Layout[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLayout, setEditingLayout] = useState<Partial<Layout>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadLayouts()
  }, [])

  const loadLayouts = async () => {
    try {
      const data = await layoutsService.getLayouts()
      setLayouts(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSave = async () => {
    try {
      if (editingLayout.id && layouts.some((l) => l.id === editingLayout.id)) {
        // Update
        await layoutsService.updateLayout(editingLayout.id, editingLayout)
        await adminService.logAction(
          'UPDATE_LAYOUT',
          `Updated layout ${editingLayout.name}`,
          editingLayout.id,
        )
      } else {
        // Create
        await layoutsService.createLayout(editingLayout as any)
        await adminService.logAction(
          'CREATE_LAYOUT',
          `Created layout ${editingLayout.name}`,
        )
      }
      toast({ title: 'Layout salvo com sucesso' })
      setDialogOpen(false)
      loadLayouts()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar layout',
        description: error.message,
      })
    }
  }

  const openNew = () => {
    setEditingLayout({
      name: '',
      description: '',
      preview_url: '',
      category: 'BASE',
      is_active: true,
      gamma_template_id: '',
    })
    setDialogOpen(true)
  }

  const openEdit = (layout: Layout) => {
    setEditingLayout(layout)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Biblioteca de Layouts
          </h1>
          <p className="text-muted-foreground">
            Gerencie os templates disponíveis na plataforma.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo Layout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {layouts.map((layout) => (
          <Card
            key={layout.id}
            className={`overflow-hidden ${!layout.is_active ? 'opacity-60 grayscale' : ''}`}
          >
            <div className="aspect-[3/4] bg-muted relative">
              <img
                src={layout.preview_url}
                alt={layout.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {layout.category}
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{layout.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {layout.description}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => openEdit(layout)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLayout.id ? 'Editar Layout' : 'Novo Layout'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={editingLayout.name}
                onChange={(e) =>
                  setEditingLayout({ ...editingLayout, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>ID do Template Gamma</Label>
              <Input
                value={editingLayout.gamma_template_id || ''}
                onChange={(e) =>
                  setEditingLayout({
                    ...editingLayout,
                    gamma_template_id: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select
                value={editingLayout.category}
                onValueChange={(val) =>
                  setEditingLayout({ ...editingLayout, category: val as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASE">Base</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                  <SelectItem value="PRO_PLUS">Pro+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>URL do Preview</Label>
              <Input
                value={editingLayout.preview_url}
                onChange={(e) =>
                  setEditingLayout({
                    ...editingLayout,
                    preview_url: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea
                value={editingLayout.description}
                onChange={(e) =>
                  setEditingLayout({
                    ...editingLayout,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={editingLayout.is_active}
                onCheckedChange={(c) =>
                  setEditingLayout({ ...editingLayout, is_active: c })
                }
              />
              <Label>Ativo (Visível para corretores)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Layout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
