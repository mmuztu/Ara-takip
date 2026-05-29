'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, QrCode } from 'lucide-react'

interface QRCodeDisplayProps {
  url: string
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const handleDownload = () => {
    const canvas = document.createElement('canvas')
    const svg = document.querySelector('#qr-code-svg') as SVGElement
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, 400, 400)
      
      const link = document.createElement('a')
      link.download = 'arac-kullanim-qr.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="h-6 w-6 text-primary" />
          <CardTitle>QR Kod</CardTitle>
        </div>
        <CardDescription>
          Bu QR kodu arac icine yazdirin. Suruculer telefonlariyla okutarak kullanim kaydina baslasin.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <QRCodeSVG
            id="qr-code-svg"
            value={url}
            size={256}
            level="H"
            includeMargin
          />
        </div>
        
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {url}
        </p>
        
        <Button onClick={handleDownload} variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          QR Kodu Indir
        </Button>
      </CardContent>
    </Card>
  )
}
