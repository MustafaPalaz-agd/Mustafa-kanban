import type { Board, Card, CardInput, CardPatch, Column, SearchCard } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code = "ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: init?.body ? { "content-type": "application/json" } : undefined,
    });
  } catch {
    throw new ApiError("Sunucuya ulaşılamadı.", 0, "NETWORK");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const envelope = data as
      | { error?: { code?: string; message?: string } }
      | null;
    throw new ApiError(
      envelope?.error?.message ?? `İstek başarısız (${response.status})`,
      response.status,
      envelope?.error?.code ?? "ERROR",
    );
  }

  return data as T;
}

export const api = {
  board: () => request<Board>("/api/board"),

  search: (q: string, label: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (label) params.set("label", label);
    return request<{ cards: SearchCard[] }>(`/api/cards?${params.toString()}`);
  },

  createColumn: (title: string) =>
    request<Column>("/api/columns", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  updateColumn: (id: string, patch: { title?: string; order?: number }) =>
    request<Column>(`/api/columns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  deleteColumn: (id: string) =>
    request<void>(`/api/columns/${id}`, { method: "DELETE" }),

  createCard: (input: CardInput) =>
    request<Card>("/api/cards", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateCard: (id: string, patch: CardPatch) =>
    request<Card>(`/api/cards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  deleteCard: (id: string) =>
    request<void>(`/api/cards/${id}`, { method: "DELETE" }),

  moveCard: (id: string, toColumnId: string, toIndex: number) =>
    request<Card>(`/api/cards/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ toColumnId, toIndex }),
    }),
};
