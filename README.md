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
```

`seed:big` sunucu açıkken çalıştırılır; mevcut panoyu değiştirir. Geri dönmek
için `npm run seed`.

## Başlangıç verisi

`data/board.json` içinde 3 kolon / 9 kart hazır pano vardır.

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
