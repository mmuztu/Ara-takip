-- Kullanım tablosu (KM yok)
create table if not exists kullanim (
  id uuid default gen_random_uuid() primary key,
  surucu text not null,
  baslangic_zaman timestamptz default now(),
  bitis_zaman timestamptz,
  sure_dakika integer,
  aciklama text
);

-- Sürücüler tablosu
create table if not exists suruculer (
  id uuid default gen_random_uuid() primary key,
  isim text not null unique
);

-- Sürücüleri ekle
insert into suruculer (isim) values
  ('Ferhat Buğdaycı'),
  ('Ömer Bora İnaç'),
  ('İsmail Tencere'),
  ('Yusuf Çuhadar')
on conflict (isim) do nothing;

-- RLS
alter table kullanim enable row level security;
alter table suruculer enable row level security;

create policy "kullanim_all" on kullanim for all using (true) with check (true);
create policy "suruculer_read" on suruculer for select using (true);
