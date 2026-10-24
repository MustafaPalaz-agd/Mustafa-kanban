import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Card, Column } from "../api/types";
import SortableCard from "./SortableCard";

type Props = {
  column: Column;
  index: number;
  onOpenCard: (card: Card, columnId: string) => void;
  onCreateCard: (columnId: string, title: string) => void;
  onRename: (columnId: string, title: string) => void;
  onDelete: (column: Column) => void;
};

export default function ColumnView({
  column,
  index,
  onOpenCard,
  onCreateCard,
  onRename,
  onDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  const [renaming, setRenaming] = useState(false);
  const [draftTitle, setDraftTitle] = useState(column.title);
  const [adding, setAdding] = useState(false);
  const [draftCard, setDraftCard] = useState("");

  const commitRename = () => {
    const next = draftTitle.trim();
    setRenaming(false);
    if (next && next !== column.title) onRename(column.id, next);
    else setDraftTitle(column.title);
  };

  const commitCard = () => {
    const title = draftCard.trim();
    if (title) onCreateCard(column.id, title);
    setDraftCard("");
    setAdding(false);
  };

  return (
    <section
      className={[
        "rail-column group/card relative flex h-full max-h-full min-h-[460px] w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border transition-colors sm:w-[320px]",
        isOver
          ? "border-accent/70"
          : "border-[#e2d6f2]",
      ].join(" ")}
      style={{ backgroundImage: `var(--wash-${index % 3})` }}
      aria-label={`${column.title} kolonu`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundImage: `var(--top-${index % 3})` }}
      />
      <header className="flex items-center gap-2 px-3 pt-3 pb-2">
        {renaming ? (
          <input
            autoFocus
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitRename();
              if (event.key === "Escape") {
                setDraftTitle(column.title);
                setRenaming(false);
              }
            }}
            className="min-w-0 flex-1 rounded border border-accent/50 bg-canvas px-2 py-1 text-[13px] font-semibold text-strong"
            aria-label="Kolon adı"
          />
        ) : (
          <h3
            onDoubleClick={() => setRenaming(true)}
            className="min-w-0 flex-1 truncate text-[12px] font-semibold tracking-[0.02em] text-strong/90"
            title="Yeniden adlandırmak için çift tıkla"
          >
            {column.title}
          </h3>
        )}

        <span className="rounded-full bg-strong/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-muted">
          {column.cards.length}
        </span>

        <div className="flex items-center gap-0.5 opacity-40 transition hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => {
              setDraftTitle(column.title);
              setRenaming(true);
            }}
            className="rounded p-1 text-muted hover:bg-strong/10 hover:text-strong"
            aria-label="Kolonu yeniden adlandır"
            title="Yeniden adlandır"
          >
            <svg viewBox="0 0 16 16" className="size-3.5 fill-current">
              <path d="M11.3 1.7a1.5 1.5 0 0 1 2.1 0l.9.9a1.5 1.5 0 0 1 0 2.1l-7.9 7.9-3.6.9.9-3.6 7.6-8.2Zm.8 1.1-7.2 7.8 1.8-.4 7.2-7.2-.9-.9-1 .7Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(column)}
            className="rounded p-1 text-muted hover:bg-danger/20 hover:text-danger"
            aria-label="Kolonu sil"
            title="Kolonu sil"
          >
            <svg viewBox="0 0 16 16" className="size-3.5 fill-current">
              <path d="M6 2h4l.5 1H13v1.5H3V3h2.5L6 2Zm-2 4h8l-.6 7.1A1.5 1.5 0 0 1 9.9 14.5H6.1a1.5 1.5 0 0 1-1.5-1.4L4 6Z" />
            </svg>
          </button>
        </div>
      </header>

      <div
        ref={setNodeRef}
        className="flex min-h-[64px] flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2"
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              columnId={column.id}
              onOpen={onOpenCard}
            />
          ))}
        </SortableContext>

        {column.cards.length === 0 && !adding && (
          <p className="px-2 py-4 text-[11.5px] leading-relaxed text-muted">
            Henüz kart yok. Aşağıdan ilk kartı ekle ya da başka kolondan sürükle.
          </p>
        )}

        {adding ? (
          <div className="rounded-lg border border-accent/40 bg-canvas p-2">
            <textarea
              autoFocus
              rows={2}
              value={draftCard}
              onChange={(event) => setDraftCard(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  commitCard();
                }
                if (event.key === "Escape") {
                  setDraftCard("");
                  setAdding(false);
                }
              }}
              placeholder="Kart başlığı…"
              className="w-full resize-none bg-transparent text-[12.5px] text-strong placeholder:text-muted/60 focus:outline-none"
            />
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={commitCard}
                className="btn-primary rounded px-3 py-1 text-[11.5px] font-semibold"
              >
                Ekle
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftCard("");
                  setAdding(false);
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
            onClick={() => setAdding(true)}
            className="mt-1 flex items-center gap-1.5 rounded-lg px-2 py-2 text-left text-[11.5px] text-muted transition hover:bg-strong/5 hover:text-strong"
          >
            <svg viewBox="0 0 16 16" className="size-3.5 fill-current">
              <path d="M8 2.5a.9.9 0 0 1 .9.9V7h3.6a.9.9 0 0 1 0 1.8H8.9v3.6a.9.9 0 0 1-1.8 0V8.8H3.5a.9.9 0 0 1 0-1.8h3.6V3.4A.9.9 0 0 1 8 2.5Z" />
            </svg>
            Kart ekle
          </button>
        )}
      </div>
    </section>
  );
}
