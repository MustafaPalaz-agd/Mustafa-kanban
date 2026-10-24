export type ColumnRow = {
  id: string;
  title: string;
  position: number;
};

export type CardRow = {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  label: string | null;
  due_date: string | null;
  position: number;
};

export type BoardCard = {
  id: string;
  title: string;
  description: string | null;
  label: string | null;
  dueDate: string | null;
  order: number;
};

export type BoardColumn = {
  id: string;
  title: string;
  order: number;
  cards: BoardCard[];
};

/** DB satırı -> sözleşmedeki kart (position -> order). */
export const toCard = (row: CardRow): BoardCard => ({
  id: row.id,
  title: row.title,
  description: row.description,
  label: row.label,
  dueDate: row.due_date,
  order: row.position,
});

/** Arama yanıtı için kolon bilgisi eklenmiş kart. */
export const toCardWithColumn = (row: CardRow) => ({
  id: row.id,
  columnId: row.column_id,
  title: row.title,
  description: row.description,
  label: row.label,
  dueDate: row.due_date,
  order: row.position,
});

export const toColumn = (
  row: ColumnRow,
  cards: BoardCard[],
): BoardColumn => ({
  id: row.id,
  title: row.title,
  order: row.position,
  cards,
});

/**
 * Türkçe duyarsız arama anahtarı.
 * İstanbul -> istanbul, IŞIK -> isik, Çağrı -> cagri
 */
export function fold(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/g, "i")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u");
}
