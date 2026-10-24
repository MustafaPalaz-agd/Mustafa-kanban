import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { db, BOARD_JSON_PATH } from "../db";
import {
  type BoardColumn,
  type CardRow,
  type ColumnRow,
  toCard,
  toCardWithColumn,
  toColumn,
} from "./mapper";

export type BoardInput = {
  columns: Array<{
    id?: string;
    title: string;
    cards?: Array<{
      id?: string;
      title: string;
      description?: string | null;
      label?: string | null;
      dueDate?: string | null;
    }>;
  }>;
};

export function getBoard(): { columns: BoardColumn[] } {
  const columns = db
    .prepare("SELECT id, title, position FROM columns ORDER BY position ASC")
    .all() as ColumnRow[];
  const cards = db
    .prepare(
      "SELECT * FROM cards ORDER BY column_id ASC, position ASC",
    )
    .all() as CardRow[];

  const byColumn = new Map<string, CardRow[]>();
  for (const card of cards) {
    const list = byColumn.get(card.column_id);
    if (list) list.push(card);
    else byColumn.set(card.column_id, [card]);
  }

  return {
    columns: columns.map((col) =>
      toColumn(col, (byColumn.get(col.id) ?? []).map(toCard)),
    ),
  };
}

export function findColumn(id: string): ColumnRow | undefined {
  return db
    .prepare("SELECT id, title, position FROM columns WHERE id = ?")
    .get(id) as ColumnRow | undefined;
}

export function findCard(id: string): CardRow | undefined {
  return db.prepare("SELECT * FROM cards WHERE id = ?").get(id) as
    | CardRow
    | undefined;
}

export function columnWithCards(id: string): BoardColumn | null {
  const column = findColumn(id);
  if (!column) return null;
  const cards = db
    .prepare("SELECT * FROM cards WHERE column_id = ? ORDER BY position ASC")
    .all(id) as CardRow[];
  return toColumn(column, cards.map(toCard));
}

export function nextColumnPosition(): number {
  const row = db
    .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM columns")
    .get() as { next: number };
  return row.next;
}

export function nextCardPosition(columnId: string): number {
  const row = db
    .prepare(
      "SELECT COALESCE(MAX(position), -1) + 1 AS next FROM cards WHERE column_id = ?",
    )
    .get(columnId) as { next: number };
  return row.next;
}

/** Bir kolonun kart sıralarını 0..n-1 olarak yeniden yazar. */
export function compactCardPositions(columnId: string): void {
  const rows = db
    .prepare("SELECT id FROM cards WHERE column_id = ? ORDER BY position ASC")
    .all(columnId) as Array<{ id: string }>;
  const update = db.prepare("UPDATE cards SET position = ? WHERE id = ?");
  rows.forEach((row, index) => update.run(index, row.id));
}

/** Kolon sıralarını 0..n-1 olarak yeniden yazar. */
export function compactColumnPositions(): void {
  const rows = db
    .prepare("SELECT id FROM columns ORDER BY position ASC")
    .all() as Array<{ id: string }>;
  const update = db.prepare("UPDATE columns SET position = ? WHERE id = ?");
  rows.forEach((row, index) => update.run(index, row.id));
}

export function listColumnIds(): string[] {
  return (
    db
      .prepare("SELECT id FROM columns ORDER BY position ASC")
      .all() as Array<{ id: string }>
  ).map((r) => r.id);
}

export function listCardIds(columnId: string): string[] {
  return (
    db
      .prepare("SELECT id FROM cards WHERE column_id = ? ORDER BY position ASC")
      .all(columnId) as Array<{ id: string }>
  ).map((r) => r.id);
}

/** Tüm panoyu silip gelen panoyu yazar (import). */
export function replaceBoard(board: BoardInput): {
  columns: number;
  cards: number;
} {
  const columns = Array.isArray(board?.columns) ? board.columns : [];
  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM cards");
    db.exec("DELETE FROM columns");

    const insertColumn = db.prepare(
      "INSERT INTO columns (id, title, position) VALUES (?, ?, ?)",
    );
    const insertCard = db.prepare(
      `INSERT INTO cards (id, column_id, title, description, label, due_date, position)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );

    let cardCount = 0;
    columns.forEach((column, columnIndex) => {
      const columnId = column.id ?? randomUUID();
      insertColumn.run(columnId, column.title, columnIndex);
      (column.cards ?? []).forEach((card, cardIndex) => {
        insertCard.run(
          card.id ?? randomUUID(),
          columnId,
          card.title,
          card.description ?? null,
          card.label ?? null,
          card.dueDate ?? null,
          cardIndex,
        );
        cardCount += 1;
      });
    });

    db.exec("COMMIT");
    return { columns: columns.length, cards: cardCount };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

/**
 * Veritabanı ilk kez oluşturulduysa data/board.json ile doldurur.
 * Kullanıcı tüm kolonları silse bile ikinci açılışta geri gelmez (meta.seeded).
 */
export function seedIfEmpty(): boolean {
  const marker = db
    .prepare("SELECT value FROM meta WHERE key = 'seeded'")
    .get() as { value: string } | undefined;
  if (marker) return false;

  const count = db.prepare("SELECT COUNT(*) AS n FROM columns").get() as {
    n: number;
  };

  let seeded = false;
  if (count.n === 0 && existsSync(BOARD_JSON_PATH)) {
    const raw = JSON.parse(readFileSync(BOARD_JSON_PATH, "utf8")) as
      | BoardInput
      | { board: BoardInput };
    const board = "board" in raw ? raw.board : raw;
    replaceBoard(board);
    seeded = true;
  }

  db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded', '1')").run();
  return seeded;
}

export { toCardWithColumn };
