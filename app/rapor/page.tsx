import { Navigation } from '@/components/navigation'
import { ReportGenerator } from '@/components/report-generator'
import { getUsageRecords } from '@/app/actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RaporPage() {
  const { data: records } = await getUsageRecords()
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Kullanım Raporu</h1>
          <p className="text-muted-foreground text-sm mt-1">Tüm araç kullanım geçmişi</p>
        </div>
        <ReportGenerator records={records} />
      </main>
    </div>
  )
}
