# PLAN — Kanban (Trello klonu)

Bu dosya tek doğruluk kaynağıdır. Bir karar değişirse önce buraya yazılır.

## 1. Kapsam

Kolonlar ve kartlardan oluşan Kanban panosu. Kartlar sürükle-bırak ile kolonlar
arasında ve kolon içinde taşınır. Tüm veri API üzerinden gelir ve SQLite
dosyasında kalıcıdır.

- `api/` → Express 4 + TypeScript + zod + `node:sqlite` (`:3001`)
- `web/` → Vite + React + TS + Tailwind + @dnd-kit + TanStack Query (`:5173`)
- Kökte `npm run dev` ikisini birlikte kaldırır.

## 2. Klasör yapısı

```
kanban/
├── package.json          # dev: concurrently (api + web)
├── AGENTS.md             # ajan kuralları
├── README.md             # kurulum / çalıştırma
├── data/board.json       # başlangıç panosu (3 kolon, 9 kart)
├── scripts/smoke.mjs     # sözleşme testi (12 uç nokta + move invariant)
├── docs/PLAN.md API.md KABUL.md
├── api/
│   ├── src/index.ts      # app, middleware, listen
│   ├── src/db.ts         # SQLite bağlantısı + şema
│   ├── src/routes/       # columns.ts, cards.ts, data.ts
│   └── src/lib/          # errors.ts, schemas.ts (zod), mapper.ts
└── web/
    └── src/
        ├── App.tsx
        ├── api/client.ts # fetch sarmalayıcı + tipler
        ├── components/   # Board, Column, Card, CardModal, Toolbar
        └── hooks/        # useBoard, useMoveCard (optimistic)
```

## 3. Veri şeması (SQLite)

Dosya: `api/data/kanban.sqlite`

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE columns (
  id       TEXT PRIMARY KEY,
  title    TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE cards (
  id          TEXT PRIMARY KEY,
  column_id   TEXT NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  label       TEXT,
  due_date    TEXT,          -- ISO 8601 | NULL
  position    INTEGER NOT NULL
);

CREATE INDEX idx_cards_column ON cards(column_id, position);
```

DB'de `position`, JSON'da `order`. Çeviri **yalnızca** `lib/mapper.ts` içinde yapılır.

## 4. Uç noktalar

| Metot | Yol | Başarı | Hata |
|---|---|---|---|
| GET | `/api/health` | 200 `{status:"ok"}` | — |
| GET | `/api/board` | 200 iç içe pano | — |
| POST | `/api/columns` | 201 kolon | 400 |
| PATCH | `/api/columns/:id` | 200 kolon | 400 / 404 |
| DELETE | `/api/columns/:id` | 204 (kartlar cascade) | 404 |
| POST | `/api/cards` | 201 kart | 400 |
| PATCH | `/api/cards/:id` | 200 kart | 400 / 404 |
| DELETE | `/api/cards/:id` | 204 | 404 |
| POST | `/api/cards/:id/move` | 200 | 400 / 404 |
| GET | `/api/cards?q=&label=` | 200 `{cards:[…]}` | — |
| POST | `/api/import` | 200 | 400 |
| GET | `/api/export` | 200 `{board:{…}}` | — |

Detay ve örnekler: `docs/API.md`.

## 5. Kritik kararlar

1. **Portlar sabit:** 3001 / 5173. Değiştirmek yasak.
2. **Prisma yok:** `node:sqlite` (Node 24 yerleşik). Sebep: motor indirmesi yok,
   Windows + OneDrive + Türkçe karakterli yol riski yok, migration derdi yok.
3. **Hata zarfı tek middleware'de:** `{"error":{"code","message"}}`.
4. **move:** hedef kolon yoksa 404; `toColumnId` yoksa 400; `toIndex` aralık
   dışındaysa sona clamp edilir. Sonrasında **iki kolonun da** sıraları
   transaction içinde `0..n-1` olarak yeniden yazılır.
5. **Arama:** `q` metin (title + description), `label` etiket; ikisi birlikte
   AND. Karşılaştırma Türkçe duyarsız (`toLocaleLowerCase("tr")` + diakritik
   katlama: İ→i, ı→i, ş→s, ğ→g, ü→u, ö→o, ç→c).
6. **import** hem `{board:{…}}` hem `{columns:[…]}` gövdesini kabul eder.
7. **Frontend'de sabit veri yok.** Tüm liste API'den; optimistic güncelleme
   yalnızca önbellek üzerinde.
8. **Kimlikler:** `crypto.randomUUID()`.
9. **Boş açılış:** İlk açılışta pano boştur; tablo arayüzdeki “Yeni tablo
   oluştur” akışıyla (3 boş kolon) `POST /api/import` üzerinden kurulur.
10. **Tema motoru:** 7 tema (`Varsayılan`, `Vaporwave`, `Cottagecore`,
    `Dark Academia`, `Y2K`, `Cyberpunk`, `Coquette`) aynı CSS değişkenlerini
    besler ve her birinin kendi arka plan fotoğrafı vardır
    (`web/public/themes/*.jpg`, CC0). Seçim `localStorage`'da tutulur; yeni tema
    eklemek `web/src/lib/themes.ts` + bir fotoğraf demektir.

## 6. Yapım sırası

1. İskele + dokümanlar + health + Vite proxy (bu adım).
2. DB şeması + mapper + hata middleware + zod şemaları.
3. Kolon uçları (POST/PATCH/DELETE + cascade + order sıkıştırma).
4. Kart uçları (POST/PATCH/DELETE).
5. `move` + `order` yeniden hesaplama; smoke'ta invariant testi.
6. Arama/filtre + import/export; `npm run smoke` 12/12 yeşil.
7. Arayüz: pano + CRUD + üç durum → dnd-kit → detay modalı + klavye →
   120 kartlık gizli test provası → README/commit.

## 7. Kabul kriterleri

`docs/KABUL.md` — 30 madde, 100 puan. Her turda "hangileri geçti" diye bakılır.

## 8. Durum

| Adım | Durum |
|---|---|
| 1. İskele + docs + health + proxy | tamam |
| 2. DB + mapper + hata middleware + zod | tamam |
| 3–5. Kolon/kart uçları + move invariant | tamam |
| 6. Arama/filtre + import/export | tamam |
| 7. Arayüz + dnd-kit + modal + klavye + 120 kart provası | tamam |
| 8. Boş açılış + “Yeni tablo oluştur” + 7 tema | tamam |

Kanıt: `docs/KANIT.md`.
