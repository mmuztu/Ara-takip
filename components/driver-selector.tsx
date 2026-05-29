'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getDrivers, getActiveUsageByDriver, startUsage, endUsage } from '@/app/actions'
import type { Surucu, Kullanim } from '@/types/kullanim'
import { Play, Square, Clock, CheckCircle, ArrowLeft } from 'lucide-react'

const DRIVER_COLORS: Record<string, string> = {
  'Ferhat Buğdaycı': 'bg-blue-100 text-blue-800',
  'Ömer Bora İnaç': 'bg-green-100 text-green-800',
  'İsmail Tencere': 'bg-purple-100 text-purple-800',
  'Yusuf Çuhadar': 'bg-orange-100 text-orange-800',
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h} saat ${m} dakika`
  return `${m} dakika`
}

function formatDT(dateString: string): string {
  return new Date(dateString).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function ElapsedTimer({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const calc = () => setElapsed(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000))
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [startTime])
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  return (
    <span className="font-mono text-3xl font-bold tabular-nums">
      {h > 0 && `${h} sa `}{String(m).padStart(2, '0')} dk {String(s).padStart(2, '0')} sn
    </span>
  )
}

export function DriverSelector() {
  const [drivers, setDrivers] = useState<Surucu[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [activeUsage, setActiveUsage] = useState<Kullanim | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [aciklama, setAciklama] = useState('')
  const [result, setResult] = useState<{
    surucu: string
    baslangic: string
    bitis: string
    sure: number
  } | null>(null)

  useEffect(() => {
    getDrivers().then(({ data }) => { setDrivers(data); setLoading(false) })
  }, [])

  async function handleDriverSelect(driverName: string) {
    setSelectedDriver(driverName)
    setActionLoading(true)
    const { data } = await getActiveUsageByDriver(driverName)
    setActiveUsage(data)
    setActionLoading(false)
  }

  async function handleStartUsage() {
    if (!selectedDriver) return
    setActionLoading(true)
    const { success, error, data } = await startUsage(selectedDriver, aciklama || undefined)
    if (success && data) {
      setActiveUsage(data)
    } else if (error) {
      alert(error)
    }
    setActionLoading(false)
  }

  async function handleEndUsage() {
    if (!activeUsage) return
    setActionLoading(true)
    const bitisZaman = new Date().toISOString()
    const { success, error, sure_dakika } = await endUsage(activeUsage.id)
    if (success) {
      setResult({
        surucu: activeUsage.surucu,
        baslangic: activeUsage.baslangic_zaman,
        bitis: bitisZaman,
        sure: sure_dakika || 0,
      })
      setActiveUsage(null)
    } else if (error) {
      alert(error)
    }
    setActionLoading(false)
  }

  function handleBack() {
    setSelectedDriver(null)
    setActiveUsage(null)
    setResult(null)
    setAciklama('')
  }

  if (loading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="py-12 text-center text-muted-foreground">Yükleniyor...</CardContent>
      </Card>
    )
  }

  // Kullanım bitti — özet ekranı
  if (result) {
    return (
      <Card className="max-w-md mx-auto w-full">
        <CardContent className="py-10 text-center space-y-5">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          <div>
            <h2 className="text-xl font-bold">Kullanım Tamamlandı</h2>
            <p className="text-muted-foreground text-sm mt-1">{result.surucu}</p>
          </div>
          <div className="bg-muted rounded-xl p-5 text-left space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Başlangıç</span>
              <span className="font-medium">{formatDT(result.baslangic)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bitiş</span>
              <span className="font-medium">{formatDT(result.bitis)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-muted-foreground">Toplam Süre</span>
              <span className="font-bold text-base">{formatDuration(result.sure)}</span>
            </div>
          </div>
          <Button onClick={handleBack} variant="outline" className="w-full h-12">
            <ArrowLeft className="h-4 w-4 mr-2" /> Ana Sayfaya Dön
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Sürücü seçim ekranı
  if (!selectedDriver) {
    return (
      <Card className="max-w-md mx-auto w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sürücü Seçin</CardTitle>
          <CardDescription>İsminizi seçerek devam edin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {drivers.map((driver) => (
              <button
                key={driver.id}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left w-full"
                onClick={() => handleDriverSelect(driver.isim)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${DRIVER_COLORS[driver.isim] || 'bg-gray-100 text-gray-800'}`}>
                  {initials(driver.isim)}
                </div>
                <span className="text-lg font-medium">{driver.isim}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Aksiyon ekranı
  return (
    <Card className="max-w-md mx-auto w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Geri
          </Button>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${DRIVER_COLORS[selectedDriver] || 'bg-gray-100 text-gray-800'}`}>
            {selectedDriver}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {actionLoading ? (
          <div className="py-12 text-center text-muted-foreground animate-pulse">İşleniyor...</div>
        ) : activeUsage ? (
          // Aktif kullanım — sadece bitir butonu
          <div className="space-y-5">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-2">
              <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Aktif Kullanım</div>
              <div className="flex items-center justify-center gap-2 text-green-700">
                <Clock className="h-5 w-5" />
                <ElapsedTimer startTime={activeUsage.baslangic_zaman} />
              </div>
              <p className="text-sm text-muted-foreground">
                Başlangıç: {formatDT(activeUsage.baslangic_zaman)}
              </p>
            </div>
            <Button className="w-full h-14 text-lg bg-red-600 hover:bg-red-700" onClick={handleEndUsage}>
              <Square className="h-5 w-5 mr-2" /> Kullanımı Bitir
            </Button>
          </div>
        ) : (
          // Yeni kullanım — sadece açıklama + başlat
          <div className="space-y-5">
            <div className="bg-muted rounded-xl p-4 text-center text-sm text-muted-foreground">
              Tarih ve saat otomatik kaydedilecek
            </div>
            <div className="space-y-2">
              <Label htmlFor="aciklama">
                Açıklama <span className="text-muted-foreground text-xs">(isteğe bağlı)</span>
              </Label>
              <Input
                id="aciklama"
                placeholder="Nereye gidiyorsunuz?"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                className="h-12"
              />
            </div>
            <Button className="w-full h-14 text-lg" onClick={handleStartUsage}>
              <Play className="h-5 w-5 mr-2" /> Kullanıma Başla
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
