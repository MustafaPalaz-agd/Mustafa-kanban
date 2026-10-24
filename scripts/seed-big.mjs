#!/usr/bin/env node
/**
 * seed-big.mjs — büyük test panosunu (6 kolon / 120 kart) API'ye yükler.
 *
 * Kullanım:
 *   node scripts/seed-big.mjs
 *   API_BASE=http://localhost:3001 node scripts/seed-big.mjs
 *
 * Notlar:
 * - Sıfır bağımlılık; yalnızca global fetch (Node 24).
 * - Üretim deterministiktir: mulberry32 PRNG, Math.random kullanılmaz.
 * - Tarihler bugüne göre üretilir; böylece "geçmiş/gelecek" testi her gün geçerli kalır.
 */

const API_BASE = (process.env.API_BASE ?? "http://localhost:3001").replace(/\/+$/, "");

const COLUMN_COUNT = 6;
const CARDS_PER_COLUMN = 20;
const CARD_COUNT = COLUMN_COUNT * CARDS_PER_COLUMN; // 120

const LONG_TITLE_COUNT = 18; // %15 → 180-220 karakter
const LONG_DESC_COUNT = 12; // %10 → 400+ karakter
const PAST_DUE_COUNT = 24; // %20 geçmiş
const FUTURE_DUE_COUNT = 24; // %20 gelecek
const LABELED_COUNT = 90; // kalanı null

const LABELS = ["şehir", "iş", "acil", "tasarım"];
const COLUMN_TITLES = [
  "Yapılacak",
  "Devam Ediyor",
  "İnceleme",
  "Test",
  "Beklemede",
  "Tamamlandı",
];

const TITLE_HEADS = [
  "İstanbul Şişli ofis taşınması",
  "Güneşli kampanya görselleri",
  "Çağrı merkezi vardiya planı",
  "Işık hızında teslimat denemesi",
  "Öğle arası toplantı notları",
  "Şişli mağaza vitrin düzeni",
  "İstanbul trafik verisi analizi",
  "Güneşli bahçe etkinliği hazırlığı",
  "Çağrı scripti güncellemesi",
  "Işık ölçüm cihazı kalibrasyonu",
  "Öğle menüsü fiyat kontrolü",
  "Şişli otopark yönlendirme levhaları",
];

const TITLE_TAILS = [
  "planlaması",
  "kontrol listesi",
  "için taslak",
  "son kontrol",
  "onay süreci",
  "için geri bildirim turu",
  "kapsam notu",
  "için ölçüm raporu",
];

// Uzun başlık üretiminde kullanılan kelimeler (hepsi en fazla 12 karakter).
const LONG_TITLE_WORDS = [
  "İstanbul",
  "Şişli",
  "Güneşli",
  "Çağrı",
  "Öğle",
  "Işık",
  "planlama",
  "koordinasyon",
  "doğrulama",
  "iyileştirme",
  "hazırlık",
  "ölçüm",
  "rapor",
  "kontrol",
  "taslak",
  "onay",
  "ekip",
  "müşteri",
  "ziyaret",
  "takvim",
  "bütçe",
  "lojistik",
];

const DESC_PARTS = [
  "Müşteri geri bildirimleri toplandı ve önceliklendirildi.",
  "Tasarım ekibi Şişli ofisinde yeni akışı denedi.",
  "Öğle toplantısında Işık ve Çağrı ile kapsam netleşti.",
  "Güneşli şubeden gelen ölçümler tabloya işlendi.",
  "İstanbul ekibi için iki aşamalı bir kontrol listesi hazırlandı.",
  "Teslimat tarihleri yeniden planlandı; riskler not edildi.",
  "Erişilebilirlik kontrolleri tamamlandı, kalan maddeler ayrıldı.",
  "Bütçe kalemleri gözden geçirildi ve onaya sunuldu.",
  "Kullanıcı akışı için kısa bir video kaydı alındı.",
  "Teknik borç listesi güncellendi; öncelik sırası korundu.",
  "Etiketleme kuralları ekip içinde paylaşıldı.",
  "Sonraki tur için ölçüm kriterleri belirlendi.",
];

// --- deterministik PRNG (mulberry32) ---
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rnd() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(20261024);

/** Diziden deterministik eleman seçer. */
function pick(arr) {
  return arr[Math.floor(rnd() * arr.length)];
}

/** Fisher-Yates; diziyi yerinde karıştırır (PRNG deterministik). */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Bugüne göre offset günlük ISO 8601 tarih üretir (UTC gece yarısı). */
function isoDay(offsetDays) {
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return new Date(todayUtc + offsetDays * 86_400_000).toISOString();
}

const ALL_INDEXES = Array.from({ length: CARD_COUNT }, (_, i) => i);

// Özellik dağılımı indekslere karıştırılarak atanır (korelasyonu azaltır).
const longTitleSet = new Set(shuffle([...ALL_INDEXES]).slice(0, LONG_TITLE_COUNT));
const longDescSet = new Set(shuffle([...ALL_INDEXES]).slice(0, LONG_DESC_COUNT));

const dueSlots = shuffle([
  ...Array(PAST_DUE_COUNT).fill("past"),
  ...Array(FUTURE_DUE_COUNT).fill("future"),
  ...Array(CARD_COUNT - PAST_DUE_COUNT - FUTURE_DUE_COUNT).fill(null),
]);

const labelSlots = shuffle([
  ...Array.from({ length: LABELED_COUNT }, () => pick(LABELS)),
  ...Array(CARD_COUNT - LABELED_COUNT).fill(null),
]);

/** Normal başlık: kısa ve okunur. Uzun başlık: 180-220 karakter. */
function makeTitle(index) {
  const head = pick(TITLE_HEADS);
  if (!longTitleSet.has(index)) {
    return `${head} — ${pick(TITLE_TAILS)}`;
  }

  // 185-199 hedef; son kelime en fazla 12 karakter → üst sınır 212.
  const target = 185 + Math.floor(rnd() * 15);
  let text = head;
  while (text.length < target) {
    text += " " + pick(LONG_TITLE_WORDS);
  }
  return text;
}

/** Normal açıklama kısa; uzun açıklama 400+ karakter. */
function makeDescription(index) {
  const long = longDescSet.has(index);
  const target = long ? 420 + Math.floor(rnd() * 80) : 60 + Math.floor(rnd() * 80);

  let text = pick(DESC_PARTS);
  while (text.length < target) {
    text += " " + pick(DESC_PARTS);
  }
  return text;
}

/** Deterministik panoyu üretir. */
function buildBoard() {
  const columns = [];

  for (let c = 0; c < COLUMN_COUNT; c++) {
    const cards = [];

    for (let k = 0; k < CARDS_PER_COLUMN; k++) {
      const index = c * CARDS_PER_COLUMN + k;
      const dueKind = dueSlots[index];

      cards.push({
        id: `seed-card-${index + 1}`,
        title: makeTitle(index),
        description: makeDescription(index),
        label: labelSlots[index],
        dueDate:
          dueKind === "past"
            ? isoDay(-(1 + Math.floor(rnd() * 60)))
            : dueKind === "future"
              ? isoDay(1 + Math.floor(rnd() * 60))
              : null,
        order: k,
      });
    }

    columns.push({
      id: `seed-col-${c + 1}`,
      title: COLUMN_TITLES[c],
      order: c,
      cards,
    });
  }

  return { columns };
}

/** HTTP isteği; ağ hatasını anlaşılır mesaja çevirir. */
async function request(path, init = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "content-type": "application/json", ...(init.headers ?? {}) },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    throw new Error(`API'ye ulaşılamadı (${API_BASE}${path}). Sunucu kapalı olabilir. (${err.message})`);
  }

  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  return { res, body, text };
}

/** Sunucu ayakta mı? Değilse anlaşılır hata fırlatır. */
async function checkHealth() {
  const { res, body, text } = await request("/api/health");

  if (!res.ok) {
    throw new Error(`/api/health ${res.status} döndü: ${text.slice(0, 200)}`);
  }
  if (body?.status !== "ok") {
    throw new Error(`/api/health beklenmeyen yanıt verdi: ${text.slice(0, 200)}`);
  }

  console.log(`Sunucu hazır: ${API_BASE}`);
}

async function main() {
  const board = buildBoard();

  const longTitles = board.columns.flatMap((c) => c.cards).filter((card) => card.title.length >= 180).length;
  const longDescriptions = board.columns
    .flatMap((c) => c.cards)
    .filter((card) => (card.description?.length ?? 0) >= 400).length;
  const labeled = board.columns.flatMap((c) => c.cards).filter((card) => card.label !== null).length;
  const past = board.columns.flatMap((c) => c.cards).filter((card) => card.dueDate && card.dueDate < new Date().toISOString()).length;
  const future = board.columns
    .flatMap((c) => c.cards)
    .filter((card) => card.dueDate && card.dueDate >= new Date().toISOString()).length;

  await checkHealth();

  console.log("Pano yükleniyor…");
  const { res, body, text } = await request("/api/import", {
    method: "POST",
    body: JSON.stringify({ board }),
  });

  if (!res.ok) {
    const detail = body?.error?.message ?? text.slice(0, 300);
    throw new Error(`/api/import ${res.status} döndü: ${detail}`);
  }

  const check = await request("/api/board");
  if (!check.res.ok) {
    throw new Error(`/api/board ${check.res.status} döndü: ${check.text.slice(0, 300)}`);
  }

  const columns = check.body?.columns ?? [];
  const totalCards = columns.reduce((sum, column) => sum + (column.cards?.length ?? 0), 0);

  if (columns.length !== COLUMN_COUNT || totalCards !== CARD_COUNT) {
    throw new Error(
      `Doğrulama başarısız: beklenen ${COLUMN_COUNT} kolon / ${CARD_COUNT} kart, ` +
        `gelen ${columns.length} kolon / ${totalCards} kart.`,
    );
  }

  const emptyColumns = columns.filter((column) => (column.cards?.length ?? 0) !== CARDS_PER_COLUMN);
  if (emptyColumns.length > 0) {
    const detail = emptyColumns.map((column) => `${column.id}=${column.cards?.length ?? 0}`).join(", ");
    throw new Error(`Kolon başına ${CARDS_PER_COLUMN} kart bekleniyordu; farklı: ${detail}`);
  }

  console.log("Pano yüklendi: 6 kolon / 120 kart");
  console.log(
    `  uzun başlık: ${longTitles}, uzun açıklama: ${longDescriptions}, ` +
      `etiketli: ${labeled}, geçmiş tarih: ${past}, gelecek tarih: ${future}`,
  );
  console.log(`  doğrulama: GET /api/board → ${columns.length} kolon / ${totalCards} kart`);
}

main().catch((err) => {
  console.error(`HATA: ${err.message}`);
  process.exit(1);
});
