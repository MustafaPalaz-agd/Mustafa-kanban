# KABUL KRİTERLERİ — 30 madde / 100 puan

Her turda: hangi maddeler geçti, hangileri açık? Kanıtsız madde "geçti" sayılmaz.

## A · Backend (40 puan) — otomatik test

- [ ] **B1** (3p) Sunucu :3001'de kalkar, `GET /api/health` → 200 `{"status":"ok"}`
- [ ] **B2** (5p) `GET /api/board` sözleşmedeki iç içe yapıyı birebir döndürür
- [ ] **B3** (5p) Kolon uçları: POST 201, PATCH 200, DELETE 204 + kartlar cascade
- [ ] **B4** (5p) Kart uçları: POST 201, PATCH 200 (yalnız gönderilen alan), DELETE 204
- [ ] **B5** (7p) `move` hedef indekse koyar; iki kolonun order'ı 0..n-1
- [ ] **B6** (4p) `GET /api/cards?q=&label=` birlikte çalışır, harf duyarsız
- [ ] **B7** (5p) Doğrulama: boş başlık 400, olmayan id 404, hata zarfı
- [ ] **B8** (4p) Kalıcılık: sunucu kapat-aç, veri yerinde
- [ ] **B9** (2p) `import` / `export` aynı biçimde, import mevcut veriyi temizler

## B · Frontend (30 puan) — canlı denenir

- [ ] **F1** (5p) Kolon/kart ekle-düzenle-sil arayüzden, hepsi API'ye gider
- [ ] **F2** (5p) DnD ile kart başka kolona taşınır, yenilenince kalır
- [ ] **F3** (4p) DnD ile aynı kolon içinde sıralanır, sıra kalıcı
- [ ] **F4** (4p) Kart detayı: açıklama, etiket, son tarih düzenlenip kaydedilir
- [ ] **F5** (3p) Metin arama + etiket filtresi birlikte; boş sonuç mesajı
- [ ] **F6** (3p) Yükleniyor / boş / hata durumları ayrı ayrı görünür
- [ ] **F7** (3p) İyimser güncelleme + hata olunca geri alma + uyarı
- [ ] **F8** (2p) Klavye: `N` yeni kart, `/` aramaya odak, `Esc` kapat
- [ ] **F9** (1p) 1024px altında kolonlar yatay kayar, taşma yok

## C · Kenar durumlar (15 puan) — gizli veri

- [ ] **E1** (5p) Yüzlerce kartlı import sonrası donma yok, DnD akıcı
- [ ] **E2** (3p) Çok uzun başlık/açıklama düzeni bozmaz (sarma/kırpma)
- [ ] **E3** (3p) Türkçe karakterler doğru; arama `İstanbul` ↔ `istanbul`
- [ ] **E4** (2p) Geçmiş son tarihli kart görsel olarak işaretli
- [ ] **E5** (2p) Import sonrası yenileme aynı veriyi getirir

## D · Süreç kalitesi (10 puan)

- [ ] **P1** (3p) `docs/PLAN.md`: yapı, şema, uç noktalar, yapım sırası
- [ ] **P2** (2p) `AGENTS.md`: yığın, portlar, komutlar, kurallar
- [ ] **P3** (2p) ≥5 anlamlı commit (`feat:`, `fix:` …)
- [ ] **P4** (3p) `README.md`: yazan komut gerçekten çalışıyor

## E · Cila (5 puan)

- [ ] **C1** (2p) Görsel tutarlılık: tipografi, boşluk, renk sistemi
- [ ] **C2** (2p) DnD ve detay açılışı akıcı; bırakma yeri belli
- [ ] **C3** (1p) Boş durum metinleri insan diliyle

## Eşitlik bozucu sırası

B5 → F2 + F3 → teslim saati.
