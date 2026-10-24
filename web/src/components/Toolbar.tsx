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
  onThemes: () => void;
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
  onThemes,
}: Props) {
  return (
    <header className="border-b border-line/80 bg-panel/70 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex items-baseline gap-2.5">
          <span className="grad-text font-display text-[22px] leading-none">
            Tahta
          </span>
          <span className="text-[11px] text-muted">
            Kanban panosu ·{" "}
            <span className="font-mono text-strong/70">{totalCards}</span> kart
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
              className="w-44 rounded-lg border border-line bg-canvas py-1.5 pr-8 pl-8 text-[12.5px] text-strong placeholder:text-muted/60 focus:border-accent/60 focus:outline-none sm:w-56"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-line px-1 font-mono text-[9.5px] text-muted">
              /
            </kbd>
          </div>

          <select
            value={label}
            onChange={(event) => onLabel(event.target.value)}
            aria-label="Etikete göre filtrele"
            className="rounded-lg border border-line bg-canvas px-2 py-1.5 text-[12.5px] text-strong focus:border-accent/60 focus:outline-none"
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
              className="rounded-lg border border-line px-2 py-1.5 text-[12px] text-muted transition hover:border-accent/50 hover:text-strong"
            >
              Filtreyi temizle
            </button>
          )}

          <button
            type="button"
            onClick={onThemes}
            title="Tema seç"
            aria-label="Tema seç"
            className="flex items-center gap-1.5 rounded-lg border border-line bg-panel/60 px-2 py-1.5 text-[12px] text-muted transition hover:border-accent/50 hover:text-strong"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 fill-current">
              <path d="M8 1.5a6.5 6.5 0 0 0 0 13h1.1a1.6 1.6 0 0 0 1.2-2.6 1.6 1.6 0 0 1 1.2-2.6H13a1.5 1.5 0 0 0 1.5-1.5A6.5 6.5 0 0 0 8 1.5Zm-3 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3-1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3.5 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
            </svg>
            <span className="hidden sm:inline">Tema</span>
          </button>

          <button
            type="button"
            onClick={onNewCard}
            className="btn-primary flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold"
          >
            Yeni kart
            <kbd className="rounded border border-strong/25 px-1 font-mono text-[9.5px] font-normal text-strong/70">
              N
            </kbd>
          </button>
        </div>
      </div>
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-sky/70 via-accent/70 to-butter/70"
      />
    </header>
  );
}
