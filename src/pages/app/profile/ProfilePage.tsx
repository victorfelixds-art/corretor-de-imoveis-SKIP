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
import useAuthStore from '@/stores/useAuthStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8 max-w-[800px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-secondary mt-1">
          Gerencie suas informações pessoais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Seus dados de identificação na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage
                src={`https://img.usecurling.com/ppl/medium?gender=male&seed=${user?.id}`}
              />
              <AvatarFallback className="text-2xl">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Alterar Foto
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input defaultValue={user?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                defaultValue={user?.email || ''}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2">
              <Label>CRECI</Label>
              <Input placeholder="00000-F" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-muted/20">
          <Button variant="ghost">Cancelar</Button>
          <Button>Salvar Alterações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Gerencie sua senha e acesso.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full sm:w-auto">
            Redefinir Senha
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
