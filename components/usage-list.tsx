'use client'

import { Kullanim } from '@/types/kullanim'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Clock, User } from 'lucide-react'
import { deleteUsage } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface UsageListProps {
  records: Kullanim[]
}

function formatDuration(minutes: number | null): string {
  if (minutes === null) return '-'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours} saat ${mins} dk`
  }
  return `${mins} dakika`
}

export function UsageList({ records }: UsageListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kaydi silmek istediginizden emin misiniz?')) return
    
    setDeletingId(id)
    await deleteUsage(id)
    router.refresh()
    setDeletingId(null)
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Henuz kullanim kaydi bulunmuyor.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {records.map((record) => {
        const isActive = record.bitis_zaman === null
        
        return (
          <Card key={record.id} className={isActive ? 'border-primary border-2' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-lg">{record.surucu}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <Badge variant="default" className="bg-green-600">Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Tamamlandi</Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(record.id)}
                    disabled={deletingId === record.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Baslangic:</strong> {formatDate(record.baslangic_zaman)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Bitis:</strong> {record.bitis_zaman ? formatDate(record.bitis_zaman) : '-'}
                  </span>
                </div>
                {!isActive && (
                  <div className="col-span-2 pt-2 border-t">
                    <strong>Toplam Sure:</strong> {formatDuration(record.sure_dakika)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
