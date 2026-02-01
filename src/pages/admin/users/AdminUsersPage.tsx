import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { adminService } from '@/services/admin'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, Shield, CreditCard, Edit } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creditForm, setCreditForm] = useState({
    monthly: 0,
    extra: 0,
    reason: '',
  })

  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    )
  }, [search, users])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await adminService.getUsers()
      setUsers(data)
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao carregar usuários' })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (
    userId: string,
    newRole: 'admin' | 'corretor',
  ) => {
    if (!confirm('Tem certeza que deseja alterar o papel deste usuário?'))
      return
    try {
      await adminService.updateUserRole(userId, newRole)
      toast({ title: 'Papel atualizado com sucesso' })
      loadUsers()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao atualizar papel' })
    }
  }

  const handleAdjustCredits = async () => {
    if (!selectedUser) return
    try {
      await adminService.adjustCredits(
        selectedUser.id,
        creditForm.monthly,
        creditForm.extra,
        creditForm.reason,
      )
      toast({ title: 'Créditos ajustados' })
      setDialogOpen(false)
      loadUsers()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao ajustar créditos' })
    }
  }

  const openCreditDialog = (user: any) => {
    setSelectedUser(user)
    setCreditForm({ monthly: 0, extra: 0, reason: '' })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gerenciamento de Usuários
          </h1>
          <p className="text-muted-foreground">
            Administre acesso, papéis e créditos.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuário..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Créditos (Mês / Extra)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.name || 'Sem nome'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(val) =>
                          handleRoleChange(user.id, val as any)
                        }
                      >
                        <SelectTrigger className="w-[110px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corretor">Corretor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.subscription?.[0]?.plan || 'GRATUITO'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                        >
                          {Math.max(
                            0,
                            (user.credits?.[0]?.monthly_limit || 0) -
                              (user.credits?.[0]?.monthly_used || 0),
                          )}{' '}
                          Restantes
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          + {user.credits?.[0]?.extra_available || 0} Extras
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCreditDialog(user)}
                      >
                        <CreditCard className="h-4 w-4 mr-1" /> Ajustar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Créditos</DialogTitle>
            <DialogDescription>
              Adicione ou remova créditos para {selectedUser?.name}. Use valores
              negativos para remover.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Créditos Mensais</Label>
                <Input
                  type="number"
                  value={creditForm.monthly}
                  onChange={(e) =>
                    setCreditForm({
                      ...creditForm,
                      monthly: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Créditos Extras</Label>
                <Input
                  type="number"
                  value={creditForm.extra}
                  onChange={(e) =>
                    setCreditForm({
                      ...creditForm,
                      extra: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Motivo (Log Administrativo)</Label>
              <Input
                placeholder="Ex: Bônus por erro no sistema"
                value={creditForm.reason}
                onChange={(e) =>
                  setCreditForm({ ...creditForm, reason: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjustCredits}>Salvar Ajustes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
