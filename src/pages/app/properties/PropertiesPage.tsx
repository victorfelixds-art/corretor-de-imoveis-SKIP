import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MapPin, Ruler, DollarSign } from 'lucide-react'
import { propertiesService } from '@/services/properties'
import useAuthStore from '@/stores/useAuthStore'
import { Property } from '@/types'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

export default function PropertiesPage() {
  const { user } = useAuthStore()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) loadProperties()
  }, [user])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const data = await propertiesService.list(user!.id)
      setProperties(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Meus Imóveis</h1>
        <Button onClick={() => navigate('/app/properties/new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Imóvel
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">
            Nenhum imóvel cadastrado
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Cadastre seu primeiro imóvel para gerar propostas.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate('/app/properties/new')}
          >
            Cadastrar Agora
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video w-full bg-muted relative">
                {property.images[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Sem imagem
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="truncate">{property.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {property.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Ruler className="h-4 w-4" /> {property.sq_meters} m²
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(property.price)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.features.defaults.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() =>
                    navigate(`/app/proposals/new?property=${property.id}`)
                  }
                >
                  Gerar Proposta
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
