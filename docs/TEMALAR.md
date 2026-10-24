# Temalar ve arka plan fotoğrafları

Her tema iki katmandan oluşur:

1. **Fotoğraf** — `web/public/themes/<tema>.jpg` (1600×900, JPEG q74). Uygulama
   çalışırken internetten görsel çekmez; hepsi depoda.
2. **Renk/okunabilirlik katmanı** — `web/src/lib/themes.ts` içindeki CSS
   değişkenleri (sayfa perdesi, kolon yıkamaları, üst şeritler, buton gradyanı).

Fotoğrafın üzerine tema perdesi (`--photo-veil`) ve kolonların kendi yarı saydam
yıkamaları biner; böylece metin okunur kalırken görsel arkada görünür.

## Fotoğraf kaynakları (hepsi CC0 / kamu malı)

| Tema | Fotoğraf | Kaynak | Lisans |
|---|---|---|---|
| Varsayılan | [Pastel Mountains](https://stocksnap.io/photo/pastel-mountains-YBGD0SVHYS) — Free Nature Stock | StockSnap | CC0 |
| Vaporwave | [Arcade claw machine, neon](https://wordpress.org/photos/photo/8506660540/) — Nilo Velez | WordPress Photo Directory | CC0 |
| Cottagecore | [White daisies garden](https://www.rawpixel.com/image/3303404/free-photo-image-house-arbour-birch) | Rawpixel | CC0 |
| Dark Academia | [Antique Books](https://stocksnap.io/photo/antique-books-8LWW70V4KC) | StockSnap | CC0 |
| Y2K | [Compact disc album](https://commons.wikimedia.org/w/index.php?curid=116190144) — Taras | Wikimedia Commons | CC0 |
| Cyberpunk | [City Stree](https://stocksnap.io/photo/city-stree-HJABYGGN1D) — Drakekiker | StockSnap | CC0 |
| Coquette | [Light Pink Rose](https://commons.wikimedia.org/w/index.php?curid=113530729) — Ramya Srivastav | Wikimedia Commons | CC0 |

Adaylar [Openverse](https://openverse.org) API'siyle `license=cc0,pdm` filtresiyle
tarandı, 1600×900'e kırpılıp yeniden sıkıştırıldı (sharp).

## Yeni tema eklemek

1. `web/public/themes/yeni-tema.jpg` ekle (1600×900 önerilir).
2. `web/src/lib/themes.ts` içine bir nesne ekle: `id`, `name`, `tagline`,
   `preview` (3 renk), `photo` yolu ve `vars` (renkler + `--photo-veil`,
   `--wash-0..2`, `--top-0..2`, `--btn-grad`, `--brand-grad`).
3. Başka dosya değişmez; seçici ve arka plan otomatik görür.
