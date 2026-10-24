export type Card = {
  id: string;
  title: string;
  description: string | null;
  label: string | null;
  dueDate: string | null;
  order: number;
};

export type Column = {
  id: string;
  title: string;
  order: number;
  cards: Card[];
};

export type Board = {
  columns: Column[];
};

export type SearchCard = Card & { columnId: string };

export type CardInput = {
  columnId: string;
  title: string;
  description?: string | null;
  label?: string | null;
  dueDate?: string | null;
};

export type CardPatch = {
  title?: string;
  description?: string | null;
  label?: string | null;
  dueDate?: string | null;
};
