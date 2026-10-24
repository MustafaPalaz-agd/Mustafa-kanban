# API SÖZLEŞMESİ — değiştirilemez

Temel adres: `http://localhost:3001`. Tüm gövde/yanıtlar JSON (UTF-8).

## Uç noktalar

| Metot | Yol | Gövde / Sorgu | Başarılı yanıt |
|---|---|---|---|
| GET | `/api/health` | — | 200 `{"status":"ok"}` |
| GET | `/api/board` | — | 200 pano şeması |
| POST | `/api/columns` | `{ title }` | 201 oluşan kolon |
| PATCH | `/api/columns/:id` | `{ title?, order? }` | 200 güncel kolon |
| DELETE | `/api/columns/:id` | — | 204, kartlar da silinir |
| POST | `/api/cards` | `{ columnId, title, description?, label?, dueDate? }` | 201 oluşan kart |
| PATCH | `/api/cards/:id` | `{ title?, description?, label?, dueDate? }` | 200 güncel kart |
| DELETE | `/api/cards/:id` | — | 204 |
| POST | `/api/cards/:id/move` | `{ toColumnId, toIndex }` | 200 |
| GET | `/api/cards?q=&label=` | `q` metin, `label` etiket | 200 `{"cards":[…]}` |
| POST | `/api/import` | `{ board }` | 200 |
| GET | `/api/export` | — | 200 `{"board":{…}}` |

## Pano şeması (`GET /api/board`)

```json
{
  "columns": [
    {
      "id": "string",
      "title": "string",
      "order": 0,
      "cards": [
        {
          "id": "string",
          "title": "string",
          "description": "string | null",
          "label": "string | null",
          "dueDate": "ISO tarih | null",
          "order": 0
        }
      ]
    }
  ]
}
```

Kolon ve kartlar `order` alanına göre artan sırada döner.

## Arama yanıtı (`GET /api/cards`)

```json
{
  "cards": [
    {
      "id": "string",
      "columnId": "string",
      "title": "string",
      "description": "string | null",
      "label": "string | null",
      "dueDate": "ISO tarih | null",
      "order": 0
    }
  ]
}
```

`q` başlık + açıklamada arar; `label` etikete bakar; ikisi birlikte AND.
Karşılaştırma büyük/küçük harf duyarsızdır ve Türkçe karakterleri katlar
(`İstanbul` ↔ `istanbul`).

## Hata zarfı — her hata bu biçimde

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "title zorunlu" } }
```

| Durum | `code` |
|---|---|
| 400 | `VALIDATION_ERROR` |
| 404 | `NOT_FOUND` |
| 500 | `INTERNAL_ERROR` |

## Zorunlu davranışlar

```
POST /api/columns   {}                  -> 400
POST /api/columns   {"title":"   "}     -> 400   (boşluk = boş)
POST /api/cards     {"title":"x"}       -> 400   (columnId yok)
PATCH /api/cards/yok-boyle-id           -> 404
DELETE /api/columns/yok-boyle-id        -> 404
POST /api/cards/:id/move {"toIndex":99} -> 400   (toColumnId yok)
```

## Taşıma kuralı

`move` sonrası hem kaynak hem hedef kolonda `order` değerleri `0,1,2,…`
boşluksuz ve tekrarsız olmalıdır. `toIndex` aralık dışındaysa sona clamp edilir.

## Import / Export

`GET /api/export` → `{"board": <pano şeması>}`.
`POST /api/import` → aynı zarfı kabul eder (`{"board":{…}}`), ayrıca düz
`{"columns":[…]}` gövdesi de kabul edilir. Import mevcut veriyi tamamen siler.

## Örnekler

```bash
curl -s localhost:3001/api/health
curl -s localhost:3001/api/board
curl -s -X POST localhost:3001/api/columns -H "content-type: application/json" -d "{\"title\":\"Yeni\"}"
curl -s -X POST localhost:3001/api/cards -H "content-type: application/json" -d "{\"columnId\":\"col-backlog\",\"title\":\"Kart\"}"
curl -s "localhost:3001/api/cards?q=istanbul&label=%C5%9Fehir"
```
