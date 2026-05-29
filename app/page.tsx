import { Navigation } from '@/components/navigation'
import { Car, BarChart2, QrCode } from 'lucide-react'
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function HomePage() {
  const headerList = await headers()
  const host = headerList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const qrUrl = `${protocol}://${host}/tara`

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12 max-w-lg">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Car className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Araç Kullanım Takip</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            QR kodu arabaya asın. Sürücüler okutarak kullanımı başlatsın.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/tara"
            className="flex items-center gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all"
          >
            <QrCode className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-base">Kullanımı Başlat / Bitir</p>
              <p className="text-sm text-muted-foreground">Sürücü girişi için buraya tıkla</p>
            </div>
          </Link>

          <Link
            href="/rapor"
            className="flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all"
          >
            <BarChart2 className="h-8 w-8 text-muted-foreground shrink-0" />
            <div>
              <p className="font-semibold text-base">Rapor</p>
              <p className="text-sm text-muted-foreground">Tüm kullanım geçmişi</p>
            </div>
          </Link>
        </div>

        <div className="mt-10 p-4 bg-muted rounded-xl text-center">
          <p className="text-xs text-muted-foreground mb-2">QR kod URL'si</p>
          <p className="text-xs font-mono break-all">{qrUrl}</p>
        </div>
      </main>
    </div>
  )
}
