# AGENTS.md — ajan kuralları

## Yığın

| Katman | Seçim |
|---|---|
| API | Express 4 + TypeScript + zod + `node:sqlite` |
| Web | Vite + React 19 + TypeScript + Tailwind 4 |
| DnD | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Veri | TanStack Query (optimistic update) |
| Birlikte | `concurrently` (kökte) |

## Portlar — DEĞİŞTİRİLEMEZ

- API: **3001**
- Web: **5173** (`strictPort: true`)
- Vite proxy: `/api` → `http://localhost:3001`

## Komutlar

```bash
npm run dev          # ikisi birlikte
npm run smoke        # sözleşme testi (12 uç nokta)
npm run typecheck    # api + web tsc --noEmit
npm --prefix api run dev
npm --prefix web run dev
```

## Kurallar

1. Port, yol adı, alan adı (`columnId`, `dueDate`, `order`) ve HTTP durum kodları
   sözleşmeden **birebir** alınır. İzin verilen tek istisna yok.
2. Hata yanıtı her zaman `{"error":{"code","message"}}`. Route içinde elle
   string dönmek yasak — `lib/errors.ts` kullanılır.
3. DB'de `position`, JSON'da `order`. Çeviri sadece `lib/mapper.ts`.
4. Veri kaynağı yalnızca API. Frontend'de sabit dizi / mock veri yasak.
5. Bir uç nokta yazılınca **curl veya `npm run smoke` ile kanıtlanır**.
   "Tamam oldu" demek kanıt değildir.
6. Her yeşil adımda commit: `feat:`, `fix:`, `docs:`, `chore:`.
7. Test edilmemiş iş bitti sayılmaz. Son 10 dakikada refactor yasak.
8. Yeni kütüphane eklemeden önce sor; sürüm uydurma, `npm i <paket>` ile kur.
9. `move` davranışı değişecekse önce `scripts/smoke.mjs` içindeki invariant
   testi kırılır, sonra düzeltilir.
10. Türkçe metinlerde `İ/ı` dönüşümü `toLocaleLowerCase("tr")` ile yapılır.
