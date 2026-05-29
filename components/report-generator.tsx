'use client'

import { useState, useMemo } from 'react'
import { Kullanim } from '@/types/kullanim'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import * as XLSX from 'xlsx'

interface Props { records: Kullanim[] }

const DRIVERS = ['Ferhat Buğdaycı', 'Ömer Bora İnaç', 'İsmail Tencere', 'Yusuf Çuhadar']
const DRIVER_COLORS: Record<string, string> = {
  'Ferhat Buğdaycı': 'bg-blue-100 text-blue-800',
  'Ömer Bora İnaç': 'bg-green-100 text-green-800',
  'İsmail Tencere': 'bg-purple-100 text-purple-800',
  'Yusuf Çuhadar': 'bg-orange-100 text-orange-800',
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return '-'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h} sa ${m} dk` : `${m} dk`
}

export function ReportGenerator({ records }: Props) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [driverFilter, setDriverFilter] = useState('Tümü')

  const filtered = useMemo(() => records.filter(r => {
    const d = new Date(r.baslangic_zaman)
    if (startDate && d < new Date(startDate)) return false
    if (endDate && d > new Date(endDate + 'T23:59:59')) return false
    if (driverFilter !== 'Tümü' && r.surucu !== driverFilter) return false
    return true
  }), [records, startDate, endDate, driverFilter])

  const driverStats = useMemo(() => DRIVERS.map(d => {
    const recs = records.filter(r => r.surucu === d)
    const completed = recs.filter(r => r.bitis_zaman)
    const totalMin = completed.reduce((s, r) => s + (r.sure_dakika || 0), 0)
    const active = recs.find(r => !r.bitis_zaman)
    return { name: d, sefer: recs.length, sure: totalMin, active }
  }), [records])

  function exportToExcel() {
    const data = filtered.map(r => ({
      'Sürücü': r.surucu,
      'Başlangıç Tarihi': new Date(r.baslangic_zaman).toLocaleDateString('tr-TR'),
      'Başlangıç Saati': new Date(r.baslangic_zaman).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      'Bitiş Tarihi': r.bitis_zaman ? new Date(r.bitis_zaman).toLocaleDateString('tr-TR') : '-',
      'Bitiş Saati': r.bitis_zaman ? new Date(r.bitis_zaman).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-',
      'Süre': formatDuration(r.sure_dakika),
      'Açıklama': r.aciklama || '',
      'Durum': r.bitis_zaman ? 'Tamamlandı' : 'Aktif',
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    ws['!cols'] = [20, 16, 14, 16, 14, 12, 20, 12].map(w => ({ wch: w }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Kullanım Raporu')
    XLSX.writeFile(wb, `arac-kullanim-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">

      {/* Sürücü özet kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {driverStats.map(d => (
          <Card key={d.name} className={d.active ? 'border-2 border-green-400' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${DRIVER_COLORS[d.name]}`}>
                  {initials(d.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-xs leading-tight truncate">{d.name.split(' ')[0]}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.name.split(' ').slice(1).join(' ')}</p>
                </div>
              </div>
              {d.active && (
                <Badge className="bg-green-600 text-xs mb-2 w-full justify-center">Araçta</Badge>
              )}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sefer</span>
                  <span className="font-medium">{d.sefer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Süre</span>
                  <span className="font-medium">{formatDuration(d.sure)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtrele */}
      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Başlangıç Tarihi</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bitiş Tarihi</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Sürücü</Label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={driverFilter}
                onChange={e => setDriverFilter(e.target.value)}
              >
                <option value="Tümü">Tümü</option>
                {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <Button onClick={exportToExcel} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" /> Excel İndir
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">{filtered.length} kayıt gösteriliyor</p>
        </CardContent>
      </Card>

      {/* Tablo */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Kayıt bulunamadı.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sürücü</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Başlangıç</TableHead>
                    <TableHead>Bitiş</TableHead>
                    <TableHead>Süre</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${DRIVER_COLORS[r.surucu] || 'bg-gray-100 text-gray-800'}`}>
                            {initials(r.surucu)}
                          </div>
                          <span className="font-medium text-sm whitespace-nowrap">{r.surucu}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {new Date(r.baslangic_zaman).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {new Date(r.baslangic_zaman).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {r.bitis_zaman
                          ? new Date(r.bitis_zaman).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                          : <span className="text-green-600 font-medium">devam ediyor</span>}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{formatDuration(r.sure_dakika)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                        {r.aciklama || '-'}
                      </TableCell>
                      <TableCell>
                        {r.bitis_zaman
                          ? <Badge variant="secondary" className="text-xs">Tamamlandı</Badge>
                          : <Badge className="bg-green-600 text-xs">Aktif</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
