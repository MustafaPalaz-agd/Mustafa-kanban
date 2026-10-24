import type { SearchCard } from "../api/types";
import { formatDue, isOverdue } from "../lib/date";
import { labelTone } from "../lib/labels";
import { ErrorState, NoResults } from "./States";

type Props = {
  cards: SearchCard[];
  columns: Array<{ id: string; title: string }>;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
  onOpen: (card: SearchCard) => void;
  onClear: () => void;
  onRetry: () => void;
};

export default function SearchResults({
  cards,
  columns,
  isPending,
  isError,
  errorMessage,
  onOpen,
  onClear,
  onRetry,
}: Props) {
  if (isError) {
    return <ErrorState message={errorMessage ?? "Arama başarısız."} onRetry={onRetry} />;
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="h-4 w-40 animate-pulse rounded bg-strong/10" />
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-lg bg-strong/[0.05]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return <NoResults onClear={onClear} />;
  }

  const columnTitle = new Map(columns.map((column) => [column.id, column.title]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-2xl border border-[#e2d6f2] bg-panel/70 p-4 backdrop-blur">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="font-display text-lg text-strong">
            {cards.length} kart eşleşti
          </h2>
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] text-muted hover:text-strong"
          >
            Filtreyi temizle
          </button>
        </div>

        <ul className="mt-3 overflow-hidden rounded-xl border border-line bg-panel">
          {cards.map((card) => {
            const overdue = isOverdue(card.dueDate);
            return (
              <li key={card.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => onOpen(card)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-canvas"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-strong">
                      {card.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-muted">
                      <span>{columnTitle.get(card.columnId) ?? "Kolon"}</span>
                      {card.label && (
                        <>
                          <span className="opacity-50">·</span>
                          <span
                            className="size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: labelTone(card.label) }}
                          />
                          <span>{card.label}</span>
                        </>
                      )}
                    </p>
                  </div>
                  {card.dueDate && (
                    <span
                      className={[
                        "shrink-0 font-mono text-[10.5px]",
                        overdue ? "text-danger" : "text-muted",
                      ].join(" ")}
                    >
                      {formatDue(card.dueDate)}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
