import { DriverSelector } from '@/components/driver-selector'
import { Car } from 'lucide-react'

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Car className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Araç Kullanım Takip</h1>
        </div>
        <p className="text-muted-foreground text-sm">QR kod başarıyla okundu</p>
      </div>
      <div className="w-full max-w-md">
        <DriverSelector />
      </div>
    </div>
  )
}
