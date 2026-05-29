export interface Kullanim {
  id: string
  surucu: string
  baslangic_zaman: string
  bitis_zaman: string | null
  sure_dakika: number | null
  aciklama: string | null
}

export interface Surucu {
  id: string
  isim: string
}
