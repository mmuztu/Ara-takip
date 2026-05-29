import { Navigation } from '@/components/navigation'
import { Car, BarChart2, QrCode } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12 max-w-lg">
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
      </main>
    </div>
  )
}
