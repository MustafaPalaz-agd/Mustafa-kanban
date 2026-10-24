import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Board as BoardModel, Card, Column } from "../api/types";
import type { MoveVariables } from "../hooks/useKanban";
import CardView from "./CardView";
import ColumnView from "./ColumnView";

type Props = {
  board: BoardModel;
  onOpenCard: (card: Card, columnId: string) => void;
  onCreateCard: (columnId: string, title: string) => void;
  onMove: (vars: MoveVariables) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (column: Column) => void;
  onCreateColumn: (title: string) => void;
};

export default function Board({
  board,
  onOpenCard,
  onCreateCard,
  onMove,
  onRenameColumn,
  onDeleteColumn,
  onCreateColumn,
}: Props) {
  const [active, setActive] = useState<Card | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    const card = board.columns
      .flatMap((column) => column.cards)
      .find((item) => item.id === id);
    setActive(card ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActive(null);
    const { active: dragged, over } = event;
    if (!over) return;

    const activeId = String(dragged.id);
    if (activeId === String(over.id)) return;

    const overData = over.data.current as
      | { type?: string; columnId?: string }
      | undefined;
    const targetColumnId = overData?.columnId ?? String(over.id);
    const targetColumn = board.columns.find((c) => c.id === targetColumnId);
    if (!targetColumn) return;

    let targetIndex = targetColumn.cards.findIndex(
      (card) => card.id === String(over.id),
    );
    if (targetIndex === -1) targetIndex = targetColumn.cards.length;

    const source = board.columns.find((column) =>
      column.cards.some((card) => card.id === activeId),
    );
    if (source?.id === targetColumnId) {
      const sourceIndex = source.cards.findIndex(
        (card) => card.id === activeId,
      );
      if (sourceIndex === targetIndex) return;
    }

    onMove({ id: activeId, toColumnId: targetColumnId, toIndex: targetIndex });
  };

  const commitColumn = () => {
    const title = columnTitle.trim();
    if (title) onCreateColumn(title);
    setColumnTitle("");
    setAddingColumn(false);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActive(null)}
    >
      <div className="flex h-full items-start gap-3 overflow-x-auto overflow-y-hidden px-4 pt-1 pb-5 sm:gap-4">
        {board.columns.length === 0 && (
          <div className="mt-6 w-full max-w-md rounded-2xl border border-dashed border-line bg-white/70 p-6 backdrop-blur">
            <h2 className="font-display text-xl text-strong">Pano boş</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Henüz kolon yok. İlk kolonu oluştur, sonra kartları sürüklemeye
              başla.
            </p>

            {addingColumn ? (
              <div className="mt-4 flex items-center gap-2">
                <input
                  autoFocus
                  value={columnTitle}
                  onChange={(event) => setColumnTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") commitColumn();
                    if (event.key === "Escape") {
                      setColumnTitle("");
                      setAddingColumn(false);
                    }
                  }}
                  placeholder="Kolon adı…"
                  className="min-w-0 flex-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[13px] text-strong placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
                  aria-label="Yeni kolon adı"
                />
                <button
                  type="button"
                  onClick={commitColumn}
                  className="btn-primary rounded-lg px-3 py-1.5 text-[12px] font-semibold"
                >
                  Ekle
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingColumn(true)}
                className="btn-primary mt-4 rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold"
              >
                İlk kolonu ekle
              </button>
            )}
          </div>
        )}

        {board.columns.map((column, index) => (
          <ColumnView
            key={column.id}
            column={column}
            index={index}
            onOpenCard={onOpenCard}
            onCreateCard={onCreateCard}
            onRename={onRenameColumn}
            onDelete={onDeleteColumn}
          />
        ))}

        {board.columns.length > 0 && (
          <div className="w-[260px] shrink-0">
            {addingColumn ? (
            <div className="rounded-xl border border-accent/40 bg-rail p-2">
              <input
                autoFocus
                value={columnTitle}
                onChange={(event) => setColumnTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") commitColumn();
                  if (event.key === "Escape") {
                    setColumnTitle("");
                    setAddingColumn(false);
                  }
                }}
                placeholder="Kolon adı…"
                className="w-full rounded border border-line bg-canvas px-2 py-1.5 text-[13px] text-strong placeholder:text-muted/60 focus:border-accent/60 focus:outline-none"
                aria-label="Yeni kolon adı"
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={commitColumn}
                  className="btn-primary rounded px-3 py-1 text-[11.5px] font-semibold"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setColumnTitle("");
                    setAddingColumn(false);
                  }}
                  className="text-[11.5px] text-muted hover:text-strong"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingColumn(true)}
              className="flex w-full items-center gap-2 rounded-xl border border-dashed border-line px-3 py-3 text-left text-[12.5px] text-muted transition hover:border-accent/50 hover:text-strong"
            >
              <svg viewBox="0 0 16 16" className="size-4 fill-current">
                <path d="M8 2.5a.9.9 0 0 1 .9.9V7h3.6a.9.9 0 0 1 0 1.8H8.9v3.6a.9.9 0 0 1-1.8 0V8.8H3.5a.9.9 0 0 1 0-1.8h3.6V3.4A.9.9 0 0 1 8 2.5Z" />
              </svg>
              Kolon ekle
            </button>
            )}
          </div>
        )}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {active ? (
          <div className="w-[280px] opacity-95">
            <CardView card={active} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
