#!/usr/bin/env node
/**
 * db-check.mjs — B8 (kalıcılık) kanıtı.
 *
 * Verinin bellekte değil, diskteki api/data/kanban.sqlite dosyasında olduğunu gösterir:
 * SQLite'tan okunan kolon/kart sayıları GET /api/board ile karşılaştırılır.
 *
 * Kullanım:
 *   node scripts/db-check.mjs
 *   API_BASE=http://localhost:3001 node scripts/db-check.mjs
 */

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const API_BASE = (process.env.API_BASE ?? "http://localhost:3001").replace(/\/+$/, "");

// Çalışma dizinine güvenmeden, script konumuna göre göreli yol (Türkçe karakterli yol güvenli).
const here = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(here, "..", "api", "data", "kanban.sqlite");

/** GET /api/board; hata durumunda anlaşılır istisna fırlatır. */
async function fetchBoard() {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/board`, { signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    throw new Error(`API'ye ulaşılamadı (${API_BASE}). Sunucu kapalı olabilir. (${err.message})`);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`/api/board ${res.status} döndü: ${text.slice(0, 300)}`);
  }

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`/api/board geçerli JSON döndürmedi: ${text.slice(0, 200)}`);
  }

  if (!Array.isArray(body?.columns)) {
    throw new Error("/api/board yanıtında columns dizisi yok.");
  }
  return body.columns;
}

async function main() {
  if (!existsSync(DB_PATH)) {
    throw new Error(`SQLite dosyası bulunamadı: ${DB_PATH}\nÖnce sunucuyu çalıştırıp pano oluşturun.`);
  }

  const columns = await fetchBoard();

  const db = new DatabaseSync(DB_PATH, { readOnly: true });
  let dbColumnCount;
  let dbCardCount;
  let dbPerColumn;

  try {
    dbColumnCount = db.prepare("SELECT COUNT(*) AS n FROM columns").get().n;
    dbCardCount = db.prepare("SELECT COUNT(*) AS n FROM cards").get().n;
    dbPerColumn = db.prepare(
      "SELECT column_id AS columnId, COUNT(*) AS n FROM cards GROUP BY column_id",
    ).all();
  } finally {
    db.close();
  }

  const apiColumnCount = columns.length;
  const apiCardCount = columns.reduce((sum, column) => sum + (column.cards?.length ?? 0), 0);

  const problems = [];
  if (dbColumnCount !== apiColumnCount) {
    problems.push(`kolon sayısı: SQLite=${dbColumnCount}, API=${apiColumnCount}`);
  }
  if (dbCardCount !== apiCardCount) {
    problems.push(`kart sayısı: SQLite=${dbCardCount}, API=${apiCardCount}`);
  }

  // Kolon bazında da karşılaştır: disk ile API aynı dağılımı göstermeli.
  const diskMap = new Map(dbPerColumn.map((row) => [row.columnId, row.n]));
  for (const column of columns) {
    const diskCount = diskMap.get(column.id) ?? 0;
    const apiCount = column.cards?.length ?? 0;
    if (diskCount !== apiCount) {
      problems.push(`kolon ${column.id}: SQLite=${diskCount}, API=${apiCount}`);
    }
    diskMap.delete(column.id);
  }
  for (const [columnId, count] of diskMap) {
    problems.push(`diskte fazla kolon: ${columnId} (${count} kart)`);
  }

  console.log(`Dosya : ${DB_PATH}`);
  console.log(`SQLite: ${dbColumnCount} kolon / ${dbCardCount} kart`);
  console.log(`API   : ${apiColumnCount} kolon / ${apiCardCount} kart`);
  console.log(
    `Dağılım: ${columns.map((column) => `${column.title}=${column.cards?.length ?? 0}`).join(", ")}`,
  );

  if (problems.length > 0) {
    console.error("UYUŞMAZLIK:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  console.log("diskte dogrulandi");
}

main().catch((err) => {
  console.error(`HATA: ${err.message}`);
  process.exit(1);
});
