# Doğrulama kanıtları

Tarih: 24 Ekim 2026 · Node 24.21.0 · Windows · Edge (headless)

Bu dosyadaki her satır gerçekten koşulmuş bir komutun çıktısıdır.

## 1. Sözleşme testi — `npm run smoke`

```
B1 health · B2 pano şeması · B3 kolon+cascade · B4 kart uçları
B5 move + order invariant · B6 arama/etiket · B7 doğrulama · B9 import/export

44 geçti, 0 kaldı
```

Kapsanan zorunlu davranışlar: boş başlık → 400, `columnId` yok → 400, olmayan
id → 404 + `NOT_FOUND`, `move` + `toColumnId` yok → 400, aralık dışı `toIndex`
→ clamp + 200, aynı/başka kolonda taşıma sonrası **iki kolonda da** order
`0..n-1`.

## 2. Uçtan uca tarayıcı testi — Playwright + Edge

```
ok 3 kolon yüklendi
ok 9 kart yüklendi
ok kart eklendi (10)
ok yenileme sonrası kart duruyor
ok kart hedef kolona taşındı
ok taşıma kalıcı
ok aynı kolon içinde sıra değişti
ok yeni sıra kalıcı
ok Türkçe duyarsız arama sonuç verdi
ok arama sonucu sayısı gösterildi
ok Esc filtreyi temizledi
ok / aramaya odaklandı
ok boş durum metni görünür
ok hata durumu görünür
ok açıklama kaydedildi
ok N kısayolu modal açtı
ok Esc modalı kapattı
ok test kartı silindi
ok konsol hatası yok

19/19 geçti
```

Boş durum ve hata durumu, `/api/board` yanıtı tarayıcıda kesilerek
doğrulandı (sunucu kapatılmadan).

## 3. Gizli test provası — 6 kolon / 120 kart (`npm run seed:big`)

```
ok 120 kart DOM'a girdi
ok 6 kolon göründü
ok açılış 5 sn altında        -> 711 ms
ok sürükleme 1.5 sn altında   -> ~460 ms (900 ms bekleme hariç)
ok taşıma büyük panoda kalıcı
ok uzun metin kart düzenini bozmuyor
ok İSTANBUL araması eşleşme buldu
```

Seed içeriği: 18 uzun başlık (180–220 karakter), 12 uzun açıklama (400+),
90 etiketli kart, 24 geçmiş / 24 gelecek tarih, Türkçe karakterli başlıklar.

## 4. Kalıcılık (B8)

```
Sunucu durduruldu  ->  3001 kapalı
Sunucu tekrar açıldı  ->  3 kolon / 9 kart (aynı)
node scripts/db-check.mjs  ->  SQLite 3/9 = API 3/9 · diskte doğrulandı
```

## 5. Responsive

```
1024px: gövde yatay taşması yok, panolar yatay kayıyor
 768px: gövde yatay taşması yok
 390px: gövde yatay taşması yok, detay modalı tek sütun
```

## 6. Tip ve derleme

```
npm run typecheck  ->  api + web, hata yok
npm --prefix web run build  ->  ✓ built
```

## 7. Boş açılış ve temalar

```
ok  boş açılış: karşılama ekranı
ok  boş açılışta kolon yok
ok  tema anında uygulandı
ok  tablo oluştu (3 kolon)
ok  kart eklendi
ok  tema: Varsayılan / Vaporwave / Cottagecore / Dark Academia / Y2K / Cyberpunk / Coquette
ok  tema yenilemede korundu
ok  tablo yenilemede korundu
ok  konsol hatası yok

15 kontrol geçti
```

Her tema kendi arka plan fotoğrafıyla gelir (CC0, `web/public/themes/`,
1600×900, çevrimdışı). Kaynak listesi: `docs/TEMALAR.md`.

## Nasıl tekrar koşulur

```bash
npm run dev            # 1. terminal
npm run smoke          # 2. terminal
npm run seed:big       # 120 kartlık pano
npm run seed           # başlangıç panosuna dön
npm run db:check       # diskteki SQLite ile API'yi karşılaştır
```
