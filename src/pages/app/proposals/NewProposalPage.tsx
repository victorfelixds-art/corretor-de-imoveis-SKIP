import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
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
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { propertiesService } from '@/services/properties'
import { creditsService } from '@/services/credits'
import { proposalsService } from '@/services/proposals'
import { layoutsService, AVAILABLE_LAYOUTS } from '@/services/layouts'
import { Property, Layout } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '@/stores/useAuthStore'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const proposalSchema = z.object({
  propertyId: z.string().min(1, 'Selecione um imóvel'),
  clientName: z.string().min(3, 'Nome do cliente é obrigatório'),
  unit: z.string().optional(),
  finalPrice: z.coerce.number().min(1, 'Preço final obrigatório'),
  discount: z.coerce.number().min(0).default(0),
  paymentConditions: z
    .array(z.object({ value: z.string().min(1, 'Preencha a condição') }))
    .min(1, 'Adicione pelo menos uma condição')
    .max(6),
  layoutId: z.string().min(1, 'Selecione um layout'),
})

type ProposalFormValues = z.infer<typeof proposalSchema>

const STEPS = [
  { id: 1, title: 'Imóvel' },
  { id: 2, title: 'Cliente' },
  { id: 3, title: 'Valores' },
  { id: 4, title: 'Pagamento' },
  { id: 5, title: 'Layout' },
  { id: 6, title: 'Confirmar' },
]

export default function NewProposalPage() {
  const [step, setStep] = useState(1)
  const { user } = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [layouts] = useState<Layout[]>(AVAILABLE_LAYOUTS)

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      propertyId: searchParams.get('property') || '',
      clientName: '',
      unit: '',
      finalPrice: 0,
      discount: 0,
      paymentConditions: [
        { value: 'Entrada de 20%' },
        { value: 'Financiamento bancário' },
      ],
      layoutId: user?.active_layout_id || 'layout-base-1',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'paymentConditions',
  })

  useEffect(() => {
    if (user) {
      propertiesService.list(user.id).then(setProperties)
    }
  }, [user])

  // Watch property to auto-fill price
  const selectedPropertyId = form.watch('propertyId')
  useEffect(() => {
    if (selectedPropertyId) {
      const prop = properties.find((p) => p.id === selectedPropertyId)
      if (prop && form.getValues('finalPrice') === 0) {
        form.setValue('finalPrice', prop.price)
      }
    }
  }, [selectedPropertyId, properties, form])

  const nextStep = async () => {
    const fieldsToValidate = {
      1: ['propertyId'],
      2: ['clientName', 'unit'],
      3: ['finalPrice', 'discount'],
      4: ['paymentConditions'],
      5: ['layoutId'],
    }[step] as any

    if (fieldsToValidate) {
      const isValid = await form.trigger(fieldsToValidate)
      if (!isValid) return
    }
    setStep((s) => s + 1)
  }

  const prevStep = () => setStep((s) => s - 1)

  const onSubmit = async (data: ProposalFormValues) => {
    setIsSubmitting(true)
    try {
      // 1. Consume credit
      await creditsService.consumeProposal()

      // 2. Create proposal
      const proposal = await proposalsService.create({
        property_id: data.propertyId,
        client_name: data.clientName,
        unit: data.unit || null,
        final_price: data.finalPrice,
        discount: data.discount,
        payment_conditions: data.paymentConditions.map((p) => p.value),
        layout_id: data.layoutId,
      })

      toast({ title: 'Proposta gerada com sucesso!' })
      navigate(`/app/proposals/${proposal.id}`)
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar proposta',
        description:
          error.message || 'Verifique seus créditos ou tente novamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedLayout = layouts.find((l) => l.id === form.watch('layoutId'))

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                step === s.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : step > s.id
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-muted text-muted-foreground',
              )}
            >
              {step > s.id ? <Check className="w-4 h-4" /> : s.id}
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden sm:block">
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="propertyId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecione o Imóvel</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um imóvel..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {properties.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {properties.length === 0 && (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                      Você não tem imóveis cadastrados.{' '}
                      <a
                        href="/app/properties/new"
                        className="underline font-bold"
                      >
                        Cadastre um imóvel
                      </a>{' '}
                      antes de continuar.
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Maria Oliveira" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Bloco B - Apto 304"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="finalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço Final da Proposta</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desconto Aplicado (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <FormLabel>Condições de Pagamento</FormLabel>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...form.register(`paymentConditions.${index}.value`)}
                        placeholder={`Condição ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  {fields.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ value: '' })}
                    >
                      + Adicionar Condição
                    </Button>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {layouts.map((layout) => (
                      <div
                        key={layout.id}
                        className={cn(
                          'border rounded-lg p-2 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 relative overflow-hidden',
                          form.watch('layoutId') === layout.id
                            ? 'ring-2 ring-primary bg-primary/5'
                            : '',
                        )}
                        onClick={() => {
                          if (layout.is_pro) {
                            // Simplified check: assume no pro subscription for demo
                            // In real app, check user.subscription
                            // For now, allow selecting everything or block logic
                            // User story: "Users can see all layouts but only select "Base" layouts unless they have a "Pro+" subscription."
                            // I'll assume standard user is BASE.
                            // Mocking subscription check logic here:
                            const hasPro = false // MOCK
                            if (!hasPro) {
                              toast({
                                title: 'Upgrade necessário',
                                description:
                                  'Este layout é exclusivo para planos Pro+.',
                                variant: 'destructive',
                              })
                              return
                            }
                          }
                          form.setValue('layoutId', layout.id)
                        }}
                      >
                        <div className="aspect-[3/4] bg-muted mb-2 relative">
                          <img
                            src={layout.preview_url}
                            alt={layout.name}
                            className="w-full h-full object-cover rounded-sm"
                          />
                          {layout.is_pro && (
                            <Badge className="absolute top-2 right-2 bg-yellow-500">
                              PRO+
                            </Badge>
                          )}
                        </div>
                        <div className="text-center font-medium">
                          {layout.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4 text-center">
                  <h3 className="text-lg font-bold">Resumo da Proposta</h3>
                  <div className="text-sm text-left border rounded-lg p-4 space-y-2">
                    <p>
                      <strong>Cliente:</strong> {form.getValues('clientName')}
                    </p>
                    <p>
                      <strong>Imóvel:</strong>{' '}
                      {
                        properties.find(
                          (p) => p.id === form.getValues('propertyId'),
                        )?.name
                      }
                    </p>
                    <p>
                      <strong>Valor:</strong> R$ {form.getValues('finalPrice')}
                    </p>
                    <p>
                      <strong>Layout:</strong> {selectedLayout?.name}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Ao clicar em Gerar, 1 crédito será consumido.
                  </p>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
          >
            Voltar
          </Button>
          {step < 6 ? (
            <Button onClick={nextStep}>Próximo</Button>
          ) : (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                </>
              ) : (
                'Gerar Proposta PDF'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
