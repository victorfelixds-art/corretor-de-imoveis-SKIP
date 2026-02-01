import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { adminService } from '@/services/admin'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getAllProposals().then((data) => {
      setProposals(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Monitoramento de Propostas
        </h1>
        <p className="text-muted-foreground">
          Visão global de todas as propostas geradas.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Corretor</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Imóvel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                proposals.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {format(new Date(p.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell>{p.profile?.name || 'Desconhecido'}</TableCell>
                    <TableCell>{p.client_name}</TableCell>
                    <TableCell>{p.property?.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.status === 'Aceita'
                            ? 'success'
                            : p.status === 'Pediu ajustes'
                              ? 'warning'
                              : 'default'
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(p.final_price)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
