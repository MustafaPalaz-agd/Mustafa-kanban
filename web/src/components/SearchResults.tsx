import type { SearchCard } from "../api/types";
import { formatDue, isOverdue } from "../lib/date";
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
        <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-lg bg-white/[0.05]"
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
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg text-white">
          {cards.length} kart eşleşti
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-[12px] text-muted hover:text-white"
        >
          Filtreyi temizle
        </button>
      </div>

      <ul className="mt-3 overflow-hidden rounded-xl border border-line">
        {cards.map((card) => {
          const overdue = isOverdue(card.dueDate);
          return (
            <li key={card.id} className="border-b border-line last:border-b-0">
              <button
                type="button"
                onClick={() => onOpen(card)}
                className="flex w-full items-center gap-3 bg-panel/50 px-4 py-3 text-left transition hover:bg-panel"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-white">
                    {card.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {columnTitle.get(card.columnId) ?? "Kolon"}
                    {card.label ? ` · ${card.label}` : ""}
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
  );
}
