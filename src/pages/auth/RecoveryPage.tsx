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
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { authService } from '@/services/auth'
import { useState } from 'react'

const recoverySchema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
})

type RecoveryFormValues = z.infer<typeof recoverySchema>

export default function RecoveryPage() {
  const { toast } = useToast()
  const [isSent, setIsSent] = useState(false)

  const form = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: RecoveryFormValues) => {
    try {
      await authService.recoverPassword(data.email)
      setIsSent(true)
      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar o email de recuperação.',
      })
    }
  }

  return (
    <Card className="w-full shadow-lg border-muted/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Recuperar Senha</CardTitle>
        <CardDescription className="text-center">
          {isSent
            ? 'Verifique seu e-mail para continuar'
            : 'Digite seu e-mail para receber um link de redefinição'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Um link de recuperação foi enviado para{' '}
              <strong>{form.getValues('email')}</strong>
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSent(false)}
            >
              Tentar outro email
            </Button>
          </div>
        ) : (
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
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Link'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <Link
          to="/"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Voltar para o login
        </Link>
      </CardFooter>
    </Card>
  )
}
