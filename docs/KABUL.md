# KABUL KRİTERLERİ — 30 madde / 100 puan

Her turda: hangi maddeler geçti, hangileri açık? Kanıtsız madde "geçti" sayılmaz.

## A · Backend (40 puan) — otomatik test

- [x] **B1** (3p) Sunucu :3001'de kalkar, `GET /api/health` → 200 `{"status":"ok"}`
- [x] **B2** (5p) `GET /api/board` sözleşmedeki iç içe yapıyı birebir döndürür
- [x] **B3** (5p) Kolon uçları: POST 201, PATCH 200, DELETE 204 + kartlar cascade
- [x] **B4** (5p) Kart uçları: POST 201, PATCH 200 (yalnız gönderilen alan), DELETE 204
- [x] **B5** (7p) `move` hedef indekse koyar; iki kolonun order'ı 0..n-1
- [x] **B6** (4p) `GET /api/cards?q=&label=` birlikte çalışır, harf duyarsız
- [x] **B7** (5p) Doğrulama: boş başlık 400, olmayan id 404, hata zarfı
- [x] **B8** (4p) Kalıcılık: sunucu kapat-aç, veri yerinde
- [x] **B9** (2p) `import` / `export` aynı biçimde, import mevcut veriyi temizler

## B · Frontend (30 puan) — canlı denenir

- [x] **F1** (5p) Kolon/kart ekle-düzenle-sil arayüzden, hepsi API'ye gider
- [x] **F2** (5p) DnD ile kart başka kolona taşınır, yenilenince kalır
- [x] **F3** (4p) DnD ile aynı kolon içinde sıralanır, sıra kalıcı
- [x] **F4** (4p) Kart detayı: açıklama, etiket, son tarih düzenlenip kaydedilir
- [x] **F5** (3p) Metin arama + etiket filtresi birlikte; boş sonuç mesajı
- [x] **F6** (3p) Yükleniyor / boş / hata durumları ayrı ayrı görünür
- [x] **F7** (3p) İyimser güncelleme + hata olunca geri alma + uyarı
- [x] **F8** (2p) Klavye: `N` yeni kart, `/` aramaya odak, `Esc` kapat
- [x] **F9** (1p) 1024px altında kolonlar yatay kayar, taşma yok

## C · Kenar durumlar (15 puan) — gizli veri

- [x] **E1** (5p) Yüzlerce kartlı import sonrası donma yok, DnD akıcı
- [x] **E2** (3p) Çok uzun başlık/açıklama düzeni bozmaz (sarma/kırpma)
- [x] **E3** (3p) Türkçe karakterler doğru; arama `İstanbul` ↔ `istanbul`
- [x] **E4** (2p) Geçmiş son tarihli kart görsel olarak işaretli
- [x] **E5** (2p) Import sonrası yenileme aynı veriyi getirir

## D · Süreç kalitesi (10 puan)

- [x] **P1** (3p) `docs/PLAN.md`: yapı, şema, uç noktalar, yapım sırası
- [x] **P2** (2p) `AGENTS.md`: yığın, portlar, komutlar, kurallar
- [x] **P3** (2p) ≥5 anlamlı commit (`feat:`, `fix:` …)
- [x] **P4** (3p) `README.md`: yazan komut gerçekten çalışıyor

## E · Cila (5 puan)

- [x] **C1** (2p) Görsel tutarlılık: tipografi, boşluk, renk sistemi
- [x] **C2** (2p) DnD ve detay açılışı akıcı; bırakma yeri belli
- [x] **C3** (1p) Boş durum metinleri insan diliyle

## Eşitlik bozucu sırası

B5 → F2 + F3 → teslim saati.

## Kanıt

Koşulmuş komutlar ve çıktıları: `docs/KANIT.md`.
Tekrar üretmek için: `npm run smoke`, `npm run seed:big`, `npm run db:check`.
