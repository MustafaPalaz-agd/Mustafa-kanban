import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Board, Card, CardInput, CardPatch } from "../api/types";

export const BOARD_KEY = ["board"] as const;

export type Notify = (message: string, tone?: "info" | "error") => void;

export type MoveVariables = { id: string; toColumnId: string; toIndex: number };

const reindex = (cards: Card[]): Card[] =>
  cards.map((card, order) => ({ ...card, order }));

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu";

/** Kartı kaynaktan çıkarıp hedef kolonun indeksine yerleştirir (optimistik). */
export function applyMove(
  board: Board,
  { id, toColumnId, toIndex }: MoveVariables,
): Board {
  let moving: Card | undefined;

  const stripped = board.columns.map((column) => {
    const index = column.cards.findIndex((card) => card.id === id);
    if (index === -1) return column;
    const found = column.cards[index];
    if (found) moving = found;
    return {
      ...column,
      cards: reindex(column.cards.filter((card) => card.id !== id)),
    };
  });

  if (!moving) return board;
  const moved = moving;

  return {
    columns: stripped.map((column) => {
      if (column.id !== toColumnId) return column;
      const cards = [...column.cards];
      const index = Math.max(0, Math.min(toIndex, cards.length));
      cards.splice(index, 0, moved);
      return { ...column, cards: reindex(cards) };
    }),
  };
}

export function useKanban(notify: Notify) {
  const queryClient = useQueryClient();

  const board = useQuery({
    queryKey: BOARD_KEY,
    queryFn: api.board,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: BOARD_KEY });

  const snapshot = async (): Promise<Board | undefined> => {
    await queryClient.cancelQueries({ queryKey: BOARD_KEY });
    return queryClient.getQueryData<Board>(BOARD_KEY);
  };

  const moveCard = useMutation({
    mutationFn: (vars: MoveVariables) =>
      api.moveCard(vars.id, vars.toColumnId, vars.toIndex),
    onMutate: async (vars) => {
      const previous = await snapshot();
      if (previous) {
        queryClient.setQueryData<Board>(BOARD_KEY, applyMove(previous, vars));
      }
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BOARD_KEY, context.previous);
      }
      notify(`Taşınamadı: ${errorMessage(error)}`, "error");
    },
    onSettled: invalidate,
  });

  const createColumn = useMutation({
    mutationFn: (title: string) => api.createColumn(title),
    onSuccess: () => {
      invalidate();
      notify("Kolon eklendi");
    },
    onError: (error) => notify(`Kolon eklenemedi: ${errorMessage(error)}`, "error"),
  });

  const updateColumn = useMutation({
    mutationFn: (vars: { id: string; title: string }) =>
      api.updateColumn(vars.id, { title: vars.title }),
    onMutate: async (vars) => {
      const previous = await snapshot();
      if (previous) {
        queryClient.setQueryData<Board>(BOARD_KEY, {
          columns: previous.columns.map((column) =>
            column.id === vars.id ? { ...column, title: vars.title } : column,
          ),
        });
      }
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(BOARD_KEY, context.previous);
      notify(`Kolon güncellenemedi: ${errorMessage(error)}`, "error");
    },
    onSettled: invalidate,
  });

  const deleteColumn = useMutation({
    mutationFn: (id: string) => api.deleteColumn(id),
    onMutate: async (id) => {
      const previous = await snapshot();
      if (previous) {
        queryClient.setQueryData<Board>(BOARD_KEY, {
          columns: previous.columns
            .filter((column) => column.id !== id)
            .map((column, order) => ({ ...column, order })),
        });
      }
      return { previous };
    },
    onSuccess: () => notify("Kolon ve kartları silindi"),
    onError: (error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(BOARD_KEY, context.previous);
      notify(`Kolon silinemedi: ${errorMessage(error)}`, "error");
    },
    onSettled: invalidate,
  });

  const createCard = useMutation({
    mutationFn: (input: CardInput) => api.createCard(input),
    onMutate: async (input) => {
      const previous = await snapshot();
      if (previous) {
        const tempCard: Card = {
          id: `temp-${Date.now()}`,
          title: input.title,
          description: input.description ?? null,
          label: input.label ?? null,
          dueDate: input.dueDate ?? null,
          order: 999,
        };
        queryClient.setQueryData<Board>(BOARD_KEY, {
          columns: previous.columns.map((column) =>
            column.id === input.columnId
              ? { ...column, cards: reindex([...column.cards, tempCard]) }
              : column,
          ),
        });
      }
      return { previous };
    },
    onSuccess: () => notify("Kart eklendi"),
    onError: (error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(BOARD_KEY, context.previous);
      notify(`Kart eklenemedi: ${errorMessage(error)}`, "error");
    },
    onSettled: invalidate,
  });

  const updateCard = useMutation({
    mutationFn: (vars: { id: string; patch: CardPatch }) =>
      api.updateCard(vars.id, vars.patch),
    onMutate: async (vars) => {
      const previous = await snapshot();
      if (previous) {
        queryClient.setQueryData<Board>(BOARD_KEY, {
          columns: previous.columns.map((column) => ({
            ...column,
            cards: column.cards.map((card) =>
              card.id === vars.id ? { ...card, ...vars.patch } : card,
            ),
          })),
        });
      }
      return { previous };
    },
    onSuccess: () => notify("Kart güncellendi"),
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(BOARD_KEY, context.previous);
      notify(`Kart güncellenemedi: ${errorMessage(error)}`, "error");
    },
    onSettled: invalidate,
  });

  const deleteCard = useMutation({
    mutationFn: (id: string) => api.deleteCard(id),
    onMutate: async (id) => {
      const previous = await snapshot();
      if (previous) {
        queryClient.setQueryData<Board>(BOARD_KEY, {
          columns: previous.columns.map((column) => ({
            ...column,
            cards: reindex(column.cards.filter((card) => card.id !== id)),
          })),
        });
      }
      return { previous };
    },
    onSuccess: () => notify("Kart silindi"),
    onError: (error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(BOARD_KEY, context.previous);
      notify(`Kart silinemedi: ${errorMessage(error)}`, "error");
    },
    onSettled: invalidate,
  });

  return {
    board,
    moveCard,
    createColumn,
    updateColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
  };
}
