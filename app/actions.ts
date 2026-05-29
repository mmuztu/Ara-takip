'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDrivers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('suruculer')
    .select('*')
    .order('isim', { ascending: true })
  if (error) return { error: error.message, data: [] }
  return { data: data || [] }
}

export async function getActiveUsageByDriver(surucu: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kullanim')
    .select('*')
    .eq('surucu', surucu)
    .is('bitis_zaman', null)
    .order('baslangic_zaman', { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== 'PGRST116') return { error: error.message, data: null }
  return { data: data || null }
}

export async function startUsage(surucu: string, aciklama?: string) {
  const supabase = await createClient()
  const existing = await getActiveUsageByDriver(surucu)
  if (existing.data) {
    return { error: `${surucu} adlı sürücünün sonlandırılmamış bir kullanımı var`, data: null }
  }
  const { data, error } = await supabase
    .from('kullanim')
    .insert({ surucu, aciklama: aciklama || null })
    .select()
    .single()
  if (error) return { error: error.message, data: null }
  revalidatePath('/', 'layout')
  return { success: true, data }
}

export async function endUsage(id: string) {
  const supabase = await createClient()
  const { data: record } = await supabase
    .from('kullanim')
    .select('baslangic_zaman')
    .eq('id', id)
    .single()
  if (!record) return { error: 'Kayıt bulunamadı' }
  const bitis = new Date()
  const sure_dakika = Math.round((bitis.getTime() - new Date(record.baslangic_zaman).getTime()) / (1000 * 60))
  const { error } = await supabase
    .from('kullanim')
    .update({ bitis_zaman: bitis.toISOString(), sure_dakika })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true, sure_dakika }
}

export async function deleteUsage(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('kullanim').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getUsageRecords() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kullanim')
    .select('*')
    .order('baslangic_zaman', { ascending: false })
  if (error) return { error: error.message, data: [] }
  return { data: data || [] }
}

export async function getActiveUsages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kullanim')
    .select('*')
    .is('bitis_zaman', null)
    .order('baslangic_zaman', { ascending: false })
  if (error) return { error: error.message, data: [] }
  return { data: data || [] }
}
