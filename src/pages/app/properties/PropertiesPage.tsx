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
import { Plus, MapPin, Ruler, Search } from 'lucide-react'
import { propertiesService } from '@/services/properties'
import useAuthStore from '@/stores/useAuthStore'
import { Property } from '@/types'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

export default function PropertiesPage() {
  const { user } = useAuthStore()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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
      maximumFractionDigits: 0,
    }).format(val)
  }

  const filtered = properties.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Imóveis</h1>
          <p className="text-secondary mt-1">
            Gerencie sua carteira de propriedades.
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar imóveis..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => navigate('/app/properties/new')}
            className="shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[340px] w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <h3 className="text-lg font-medium text-foreground">
            Nenhum imóvel encontrado
          </h3>
          <p className="text-sm text-secondary mt-2">
            {searchTerm
              ? 'Tente buscar por outro termo.'
              : 'Cadastre seu primeiro imóvel para começar.'}
          </p>
          {!searchTerm && (
            <Button
              className="mt-6"
              onClick={() => navigate('/app/properties/new')}
            >
              Cadastrar Agora
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group border-border/60"
            >
              <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                {property.images[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/30">
                    Sem imagem
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
                  {formatCurrency(property.price)}
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="truncate text-base">
                  {property.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />{' '}
                  {property.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-4 pt-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded text-xs">
                    <Ruler className="h-3.5 w-3.5" /> {property.sq_meters} m²
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {property.features.defaults.slice(0, 3).map((f: string) => (
                    <span
                      key={f}
                      className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground border px-1.5 py-0.5 rounded-sm"
                    >
                      {f}
                    </span>
                  ))}
                  {property.features.defaults.length > 3 && (
                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.5">
                      + {property.features.defaults.length - 3}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 bg-muted/10">
                <Button
                  variant="secondary"
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
