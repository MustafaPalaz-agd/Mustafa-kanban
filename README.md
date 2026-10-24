# Kanban — Trello benzeri pano

Kolonlar ve kartlardan oluşan Kanban panosu. Kartlar sürükle-bırak ile taşınır,
tüm veri API üzerinden gelir ve SQLite dosyasında kalıcıdır.

- API: `http://localhost:3001`
- Arayüz: `http://localhost:5173`
- Veritabanı: `api/data/kanban.sqlite` (ilk açılışta otomatik oluşur)

## Gereksinimler

- Node.js **24+** (yerleşik `node:sqlite` kullanılıyor)
- npm 10+

## Kurulum

```bash
npm install
npm --prefix api install
npm --prefix web install
```

## Çalıştırma

```bash
npm run dev
```

Tek komut ikisini birlikte kaldırır:

- API → http://localhost:3001/api/health
- Arayüz → http://localhost:5173

Ayrı ayrı:

```bash
npm --prefix api run dev
npm --prefix web run dev
```

## İlk açılış — tablo ve tema

Uygulama **boş panoyla** açılır: hiç kolon ya da kart yoktur.

1. “Yeni tablo oluştur” düğmesine bas.
2. Açılan pencereden bir tema seç (seçtiğin an arka planda uygulanır).
3. “Tabloyu oluştur” → 3 kolonluk boş pano kurulur.

Tema seçenekleri: **Varsayılan** (mavi–pembe–sarı), **Vaporwave**,
**Cottagecore**, **Dark Academia**, **Y2K**, **Cyberpunk**, **Coquette**.
Her temanın kendi arka plan fotoğrafı vardır; tema üst çubuktaki “Tema”
düğmesinden sonradan değiştirilebilir ve tarayıcıda hatırlanır. Tüm temalar aynı
CSS değişkenlerini besler (`web/src/lib/themes.ts`), fotoğraflar
`web/public/themes/` altındadır (çevrimdışı çalışır). Kaynak/lisans listesi:
`docs/TEMALAR.md`.

Tüm kolonları silersen pano yeniden “Yeni tablo oluştur” ekranına döner.

## Sözleşme testi

```bash
npm run smoke
```

12 uç noktayı ve `move` sıralama kuralını (order = 0..n-1) doğrular.
Sunucu açıkken çalıştırılır. Test sonunda panoyu otomatik olarak eski hâline
geri yükler.

## Yardımcı komutlar

```bash
npm run seed       # data/board.json -> veritabanı (3 kolon / 9 kart)
npm run seed:big   # 6 kolon / 120 kart stres panosu (uzun metin, Türkçe, geçmiş tarih)
npm run db:check   # verinin gerçekten SQLite dosyasında olduğunu doğrular
npm --prefix api run build   # TypeScript derleme kontrolü (tsx ile çalışır, emit yok)
npm --prefix web run build   # üretim derlemesi -> web/dist
```

`seed:big` sunucu açıkken çalıştırılır; mevcut panoyu değiştirir. Geri dönmek
için `npm run seed`.

## Başlangıç verisi (isteğe bağlı)

`data/board.json` içinde 3 kolon / 9 kart hazır demo panosu vardır. Uygulama
boş açıldığı için otomatik yüklenmez; juri/demo için:

```bash
npm run seed
```

veya doğrudan API:

```bash
curl -s -X POST localhost:3001/api/import \
  -H "content-type: application/json" \
  -d "{\"board\": $(cat data/board.json)}"
```

Windows PowerShell:

```powershell
$body = @{ board = Get-Content data/board.json -Raw | ConvertFrom-Json } | ConvertTo-Json -Depth 20
Invoke-RestMethod -Method Post -Uri localhost:3001/api/import -ContentType "application/json" -Body $body
```

## Notlar

- Portlar sabittir: 3001 / 5173.
- Prisma yok; Node 24'ün yerleşik `node:sqlite` sürücüsü kullanılır.
- Sözleşme: `docs/API.md` · Plan: `docs/PLAN.md` · Kriterler: `docs/KABUL.md`
- Koşulmuş testlerin çıktıları: `docs/KANIT.md` (sözleşme 44/44, tarayıcı 19/19).
