'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, BarChart2 } from 'lucide-react'

export function Navigation() {
  const path = usePathname()
  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Araç Takip</span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${path === '/' ? 'bg-accent font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
          >
            <Car className="h-4 w-4" /> Ana Sayfa
          </Link>
          <Link
            href="/rapor"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${path === '/rapor' ? 'bg-accent font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
          >
            <BarChart2 className="h-4 w-4" /> Rapor
          </Link>
        </div>
      </div>
    </nav>
  )
}
