import { getUsageRecords, getActiveUsages } from './actions'
import { Navigation } from '@/components/navigation'
import { UsageList } from '@/components/usage-list'
import { QRCodeDisplay } from '@/components/qr-code-display'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, Clock, Users } from 'lucide-react'
import { headers } from 'next/headers'

export default async function HomePage() {
  const headerList = await headers()
  const host = headerList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const qrUrl = `${protocol}://${host}/tara`

  const [usageResult, activeResult] = await Promise.all([
    getUsageRecords(),
    getActiveUsages()
  ])
  
  const records = usageResult.data || []
  const activeUsages = activeResult.data || []
  const completedRecords = records.filter(r => r.bitis_zaman !== null)
  
  const totalMinutes = completedRecords.reduce((sum, record) => {
    return sum + (record.sure_dakika || 0)
  }, 0)
  
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Arac Kullanim Takip Sistemi</h1>
          <p className="text-muted-foreground mt-2">
            QR kodu yazdirin ve araca yapisirin. Suruculer QR okutarak kullanim baslatsın.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Car className="h-4 w-4" />
                Aktif Kullanim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeUsages.length}</p>
              {activeUsages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {activeUsages.map(u => (
                    <Badge key={u.id} variant="secondary" className="text-xs">
                      {u.surucu}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Toplam Kayit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{records.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Toplam Sure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {totalHours > 0 ? `${totalHours} sa ${remainingMinutes} dk` : `${totalMinutes} dk`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QRCodeDisplay url={qrUrl} />
          
          <Card>
            <CardHeader>
              <CardTitle>Son Kullanimlar</CardTitle>
              <CardDescription>En son eklenen kullanim kayitlari</CardDescription>
            </CardHeader>
            <CardContent>
              <UsageList records={records.slice(0, 5)} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
