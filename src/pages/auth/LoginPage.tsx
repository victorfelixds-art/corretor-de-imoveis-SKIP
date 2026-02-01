import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import useAuthStore from '@/stores/useAuthStore'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
  password: z.string().min(1, { message: 'Digite sua senha' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, user, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Role-based redirect logic
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') navigate('/admin')
      else navigate('/app')
    }
  }, [user, isLoading, navigate])

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password)
      toast({
        title: 'Login realizado com sucesso',
        description: 'Redirecionando...',
      })
      // Navigation is handled by useEffect
    } catch (error: any) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description:
          error.message || 'Verifique suas credenciais e tente novamente.',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  // If user is already logged in, show simple loading state while redirect happens
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Redirecionando...
      </div>
    )
  }

  return (
    <Card className="w-full shadow-lg border-muted/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Entrar na conta</CardTitle>
        <CardDescription className="text-center">
          Digite seu e-mail e senha para acessar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Link
                      to="/auth/recovery"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
        <div>
          Não tem uma conta?{' '}
          <Link
            to="/auth/signup"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
