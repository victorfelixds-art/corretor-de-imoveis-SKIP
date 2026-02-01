import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
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
import { Checkbox } from '@/components/ui/checkbox'
import { propertiesService } from '@/services/properties'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const propertySchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório' }),
  price: z.coerce.number().min(1, { message: 'Valor deve ser maior que zero' }),
  address: z.string().min(5, { message: 'Endereço é obrigatório' }),
  sq_meters: z.coerce.number().min(1, { message: 'Metragem é obrigatória' }),
  image1: z
    .string()
    .url({ message: 'URL inválida' })
    .min(1, { message: 'Obrigatório' }),
  image2: z
    .string()
    .url({ message: 'URL inválida' })
    .min(1, { message: 'Obrigatório' }),
  image3: z
    .string()
    .url({ message: 'URL inválida' })
    .min(1, { message: 'Obrigatório' }),
  defaultFeatures: z.array(z.string()),
  customFeatures: z.array(z.object({ value: z.string().min(1) })).max(3),
})

type PropertyFormValues = z.infer<typeof propertySchema>

const DEFAULT_FEATURES = ['Área de lazer', 'Varanda', 'Piscina']

export default function NewPropertyPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      price: 0,
      address: '',
      sq_meters: 0,
      image1: 'https://img.usecurling.com/p/800/600?q=modern%20apartment',
      image2: 'https://img.usecurling.com/p/800/600?q=living%20room',
      image3: 'https://img.usecurling.com/p/800/600?q=kitchen',
      defaultFeatures: [],
      customFeatures: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customFeatures',
  })

  const onSubmit = async (data: PropertyFormValues) => {
    setIsLoading(true)
    try {
      await propertiesService.create({
        name: data.name,
        price: data.price,
        address: data.address,
        sq_meters: data.sq_meters,
        images: [data.image1, data.image2, data.image3],
        features: {
          defaults: data.defaultFeatures,
          custom: data.customFeatures.map((f) => f.value),
        },
      })
      toast({ title: 'Imóvel cadastrado com sucesso!' })
      navigate('/app/properties')
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo Imóvel</h1>
        <p className="text-muted-foreground">
          Cadastre um novo imóvel para sua carteira
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Imóvel</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Apartamento Jardins" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Base (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sq_meters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metragem (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rua das Flores, 123 - Centro"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Imagens (Obrigatório 3)</h3>
                <CardDescription>
                  Use URLs de imagens. Para teste, já preenchemos com
                  placeholders.
                </CardDescription>
                <FormField
                  control={form.control}
                  name="image1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem 1 (Principal)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem 2</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem 3</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Diferenciais</h3>
                <div className="flex flex-col gap-2">
                  {DEFAULT_FEATURES.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="defaultFeatures"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item,
                                        ),
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <FormLabel>Extras (Máx 3)</FormLabel>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...form.register(`customFeatures.${index}.value`)}
                        placeholder="Ex: Academia"
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
                  {fields.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ value: '' })}
                    >
                      + Adicionar Extra
                    </Button>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Cadastrar Imóvel'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
