import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./api/client";
import type { Card, Column, SearchCard } from "./api/types";
import Board from "./components/Board";
import CardModal, { type CardFormValues } from "./components/CardModal";
import SearchResults from "./components/SearchResults";
import { ErrorState, LoadingState } from "./components/States";
import Toolbar from "./components/Toolbar";
import { useKanban } from "./hooks/useKanban";

type ModalState = {
  mode: "create" | "edit";
  card?: Card;
  columnId: string;
};

type Toast = { id: number; message: string; tone: "info" | "error" };

export default function App() {
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const notify = useCallback(
    (message: string, tone: "info" | "error" = "info") => {
      setToast({ id: Date.now(), message, tone });
    },
    [],
  );

  const kanban = useKanban(notify);
  const board = kanban.board.data;
  const columns = board?.columns ?? [];

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  const labels = useMemo(() => {
    const unique = new Set<string>();
    for (const column of columns) {
      for (const card of column.cards) {
        if (card.label) unique.add(card.label);
      }
    }
    return [...unique].sort((a, b) => a.localeCompare(b, "tr"));
  }, [columns]);

  const totalCards = columns.reduce(
    (total, column) => total + column.cards.length,
    0,
  );

  const term = q.trim();
  const filterActive = term.length > 0 || label.length > 0;

  const search = useQuery({
    queryKey: ["search", term, label],
    queryFn: () => api.search(term, label),
    enabled: filterActive,
    placeholderData: (previous) => previous,
  });

  const openCreate = useCallback(
    (columnId?: string) => {
      const target = columnId ?? columns[0]?.id;
      if (!target) {
        notify("Önce bir kolon ekle: sağdaki “Kolon ekle” düğmesi.", "error");
        return;
      }
      setModal({ mode: "create", columnId: target });
    },
    [columns, notify],
  );

  const openEdit = useCallback((card: Card, columnId: string) => {
    setModal({ mode: "edit", card, columnId });
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = Boolean(
        target?.closest("input, textarea, select, [contenteditable='true']"),
      );

      if (event.key === "Escape") {
        if (modal) return;
        if (filterActive) {
          setQ("");
          setLabel("");
        }
        return;
      }

      if (typing || modal) return;

      if (event.key === "/") {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        openCreate();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filterActive, modal, openCreate]);

  const clearFilters = () => {
    setQ("");
    setLabel("");
  };

  const handleSubmit = (values: CardFormValues) => {
    if (!modal) return;
    if (modal.mode === "create") {
      kanban.createCard.mutate(values);
    } else if (modal.card) {
      kanban.updateCard.mutate({
        id: modal.card.id,
        patch: {
          title: values.title,
          description: values.description,
          label: values.label,
          dueDate: values.dueDate,
        },
      });
    }
    setModal(null);
  };

  const handleDeleteCard = () => {
    if (!modal?.card) return;
    if (
      !window.confirm(`“${modal.card.title}” kartı silinsin mi?`)
    ) {
      return;
    }
    kanban.deleteCard.mutate(modal.card.id);
    setModal(null);
  };

  const handleDeleteColumn = (column: Column) => {
    const message =
      column.cards.length > 0
        ? `“${column.title}” kolonu ve içindeki ${column.cards.length} kart silinsin mi?`
        : `“${column.title}” kolonu silinsin mi?`;
    if (!window.confirm(message)) return;
    kanban.deleteColumn.mutate(column.id);
  };

  const handleCreateCard = (columnId: string, title: string) => {
    kanban.createCard.mutate({ columnId, title });
  };

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        searchRef={searchRef}
        q={q}
        label={label}
        labels={labels}
        filterActive={filterActive}
        totalCards={totalCards}
        onQ={setQ}
        onLabel={setLabel}
        onClear={clearFilters}
        onNewCard={() => openCreate()}
      />

      <main className="min-h-0 flex-1 overflow-hidden">
        {kanban.board.isPending ? (
          <div className="pt-4">
            <LoadingState />
          </div>
        ) : kanban.board.isError ? (
          <ErrorState
            message={kanban.board.error.message}
            onRetry={() => void kanban.board.refetch()}
          />
        ) : filterActive ? (
          <div className="h-full overflow-y-auto">
            <SearchResults
              cards={search.data?.cards ?? []}
              columns={columns}
              isPending={search.isPending}
              isError={search.isError}
              errorMessage={search.error?.message}
              onOpen={(card: SearchCard) =>
                setModal({
                  mode: "edit",
                  card,
                  columnId: card.columnId,
                })
              }
              onClear={clearFilters}
              onRetry={() => void search.refetch()}
            />
          </div>
        ) : (
          <Board
            board={board ?? { columns: [] }}
            onOpenCard={openEdit}
            onCreateCard={handleCreateCard}
            onMove={(vars) => kanban.moveCard.mutate(vars)}
            onRenameColumn={(id, title) =>
              kanban.updateColumn.mutate({ id, title })
            }
            onDeleteColumn={handleDeleteColumn}
            onCreateColumn={(title) => kanban.createColumn.mutate(title)}
          />
        )}
      </main>

      <footer className="flex items-center justify-between gap-4 border-t border-line/60 px-4 py-1.5 text-[10.5px] text-muted/60">
        <span className="truncate">
          Kartı tut ve başka kolona bırak · düzenlemek için tıkla
        </span>
        <span className="hidden shrink-0 items-center gap-3 sm:flex">
          <span>
            <kbd className="rounded border border-line px-1 font-mono">N</kbd>{" "}
            yeni kart
          </span>
          <span>
            <kbd className="rounded border border-line px-1 font-mono">/</kbd>{" "}
            ara
          </span>
          <span>
            <kbd className="rounded border border-line px-1 font-mono">Esc</kbd>{" "}
            kapat
          </span>
        </span>
      </footer>

      {modal && (
        <CardModal
          mode={modal.mode}
          card={modal.card}
          columnId={modal.columnId}
          columns={columns}
          labels={labels}
          busy={
            kanban.createCard.isPending || kanban.updateCard.isPending
          }
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          onDelete={modal.mode === "edit" ? handleDeleteCard : undefined}
        />
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={[
            "fixed right-4 bottom-10 z-50 max-w-sm rounded-lg border px-3.5 py-2.5 text-[12.5px] shadow-xl",
            toast.tone === "error"
              ? "border-danger/50 bg-danger/15 text-danger"
              : "border-accent/30 bg-panel text-white",
          ].join(" ")}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
