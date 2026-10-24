# Doğrulama kanıtları

Tarih: 24 Ekim 2026 · Node 24.21.0 · Windows 11 · Edge (Chromium, headless)
Test yaklaşımı: `webapp-testing` skill'i (skills.sh) + yerel Playwright koşucusu.

Bu dosyadaki her satır gerçekten koşulmuş bir komutun çıktısıdır. Test edilmeyen
madde "geçti" sayılmaz.

## 1. Sözleşme testi — `npm run smoke` → **66/66**

| Bölüm | Kapsam |
|---|---|
| B1 | health 200 + gövde |
| B2 | pano şeması, alan adları birebir, sıralar |
| B3 | kolon POST 201 / PATCH 200 / DELETE 204 + cascade + `order` yeniden dizme |
| B4 | kart POST 201 / PATCH 200 (yalnız gönderilen alan) / DELETE 204 + sıkışma |
| B5 | move: aynı kolon, kolonlar arası, clamp, index 0, olmayan kart/kolon |
| B6 | `q` + `label`, Türkçe duyarsız (İ/I/ı), açıklamada arama, boş sonuç |
| B7 | boş başlık, 404, hata zarfı, bozuk JSON |
| B9 | import/export turu birebir, geçersiz import + çakışan id |

## 2. Arayüz denetimi — Playwright → **22/22**

```
ok [E4] geçmiş tarihli kart işaretli
ok [F4] açıklama / etiket / son tarih kaydedildi, yenilemede kalıcı
ok [F5] metin araması, etiket + metin birlikte, boş sonuç mesajı, sonuçtan detay
ok [E3] IŞIK ↔ ışık ve İSTANBUL ↔ İstanbul eşleşti
ok [F6] yükleniyor iskeleti göründü (geciktirilmiş /api/board)
ok [F7] iyimser taşıma anında yansıdı, hata sonrası geri alındı + uyarı çıktı
ok [F8] "/" odak, "N" yeni kart, "Esc" kapat
ok [E5] import sonrası yenileme tutarlı (3 kolon / 9 kart)
ok [F9] 1024px gövde taşmıyor, kart içeriği taşmıyor
ok konsol/page hatası yok
```

## 3. Uçtan uca akış — **19/19**

Kart ekleme, kolon içi ve kolonlar arası sürükle-bırak, yenileme sonrası kalıcılık,
Türkçe arama, boş/hata durumları, modal, kısayollar, silme.

## 4. Temalar ve boş açılış — **15/15**

Boş karşılama ekranı, tablo oluşturma, 7 temanın anında uygulanması, tema ve
panonun yenilemede korunması.

## 5. Kolon CRUD arayüzden — **4/4**

Kolon ekleme, yeniden adlandırma, kolona kart ekleme, kolon silme (cascade).

## 6. Yük testi — 6 kolon / 120 kart → **8/8**

```
açılış          726 ms
sürükleme       ~514 ms (900 ms bekleme hariç)
uzun başlık     taşma yok (18 uzun başlık, 12 uzun açıklama)
İSTANBUL araması eşleşti
konsol hatası yok
```

## 7. Kalıcılık (B8) — gerçek kapat-aç

```
önce:  6 kolon / 120 kart
süreç: sunucular durduruldu -> temiz kopya kurulup çalıştırıldı -> durduruldu
sonra: 6 kolon / 120 kart
node scripts/db-check.mjs -> SQLite 6/120 = API 6/120 · diskte doğrulandı
```

## 8. Temiz kurulum (P4)

```
robocopy (node_modules, dist, .git, veritabanı hariç)
npm install && npm --prefix api install && npm --prefix web install
npm run dev
-> /api/health 200 {"status":"ok"}
-> http://localhost:5173/ 200
-> pano boş, api/data/kanban.sqlite ilk açılışta oluştu
-> node scripts/smoke.mjs: 66/66
```

## 9. Derleme

```
npm --prefix api run build  ->  tsc --noEmit, hata yok
npm --prefix web run build  ->  ✓ built (dist ~355 kB / gzip 107 kB)
npm run typecheck           ->  api + web, hata yok
```

## 10. Bu turda bulunan ve düzeltilen test hataları

Ürün hatası çıkmadı; iki yanlış kırmızı, testin kendi kurgusundan kaynaklanıyordu:

1. `move` testi, önceki `import` panoyu sildiği için artık var olmayan kolona kart
   eklemeye çalışıyordu → test kendi kolonunu kuruyor.
2. "N yeni kart" testi, arama alanı odaklıyken basıldığı için (doğru davranış
   olarak) kısayol tetiklenmiyordu → test önce odağı bırakıyor.
3. F7'de bilerek iptal edilen istek konsolda `net::ERR_FAILED` üretiyordu →
   yalnız bu beklenen ağ gürültüsü filtrelendi.

## Nasıl tekrar koşulur

```bash
npm run dev            # 1. terminal
npm run smoke          # 2. terminal (66 kontrol)
npm run seed           # demo panosu
npm run seed:big       # 120 kartlık pano
npm run db:check       # diskteki SQLite ile API'yi karşılaştır
```
