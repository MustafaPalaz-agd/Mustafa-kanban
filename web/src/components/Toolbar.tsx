import type { RefObject } from "react";

type Props = {
  searchRef: RefObject<HTMLInputElement | null>;
  q: string;
  label: string;
  labels: string[];
  filterActive: boolean;
  totalCards: number;
  onQ: (value: string) => void;
  onLabel: (value: string) => void;
  onClear: () => void;
  onNewCard: () => void;
};

export default function Toolbar({
  searchRef,
  q,
  label,
  labels,
  filterActive,
  totalCards,
  onQ,
  onLabel,
  onClear,
  onNewCard,
}: Props) {
  return (
    <header className="border-b border-line/80 bg-panel/70 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-display text-[22px] leading-none text-white">
            Tahta
          </span>
          <span className="text-[11px] text-muted">
            Kanban panosu ·{" "}
            <span className="font-mono text-white/70">{totalCards}</span> kart
          </span>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 fill-muted"
            >
              <path d="M7 1a6 6 0 1 0 3.6 10.8l3.3 3.3 1-1-3.3-3.3A6 6 0 0 0 7 1Zm0 1.8a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Z" />
            </svg>
            <input
              ref={searchRef}
              value={q}
              onChange={(event) => onQ(event.target.value)}
              placeholder="Kart ara"
              aria-label="Kartlarda ara"
              className="w-44 rounded-lg border border-line bg-ink/60 py-1.5 pr-8 pl-8 text-[12.5px] text-white placeholder:text-muted/60 focus:border-accent/60 focus:outline-none sm:w-56"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-line px-1 font-mono text-[9.5px] text-muted">
              /
            </kbd>
          </div>

          <select
            value={label}
            onChange={(event) => onLabel(event.target.value)}
            aria-label="Etikete göre filtrele"
            className="rounded-lg border border-line bg-ink/60 px-2 py-1.5 text-[12.5px] text-white focus:border-accent/60 focus:outline-none"
          >
            <option value="">Tüm etiketler</option>
            {labels.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {filterActive && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-line px-2 py-1.5 text-[12px] text-muted transition hover:border-accent/50 hover:text-white"
            >
              Filtreyi temizle
            </button>
          )}

          <button
            type="button"
            onClick={onNewCard}
            className="flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-[12.5px] font-semibold text-ink transition hover:bg-accent-strong"
          >
            Yeni kart
            <kbd className="rounded border border-ink/30 px-1 font-mono text-[9.5px] font-normal text-ink/70">
              N
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
