import { useEffect, useRef, useState } from "react";
import type { Card, Column } from "../api/types";
import { toDateInput } from "../lib/date";

export type CardFormValues = {
  columnId: string;
  title: string;
  description: string | null;
  label: string | null;
  dueDate: string | null;
};

type Props = {
  mode: "create" | "edit";
  card?: Card | null;
  columnId: string;
  columns: Column[];
  labels: string[];
  busy?: boolean;
  onClose: () => void;
  onSubmit: (values: CardFormValues) => void;
  onDelete?: () => void;
};

export default function CardModal({
  mode,
  card,
  columnId,
  columns,
  labels,
  busy = false,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(card?.title ?? "");
  const [description, setDescription] = useState(card?.description ?? "");
  const [label, setLabel] = useState(card?.label ?? "");
  const [dueDate, setDueDate] = useState(toDateInput(card?.dueDate ?? null));
  const [selectedColumn, setSelectedColumn] = useState(columnId);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    titleRef.current?.select();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Başlık zorunlu. Kartın ne olduğunu birkaç kelimeyle yaz.");
      return;
    }
    if (!selectedColumn) {
      setError("Kart için bir kolon seç.");
      return;
    }
    onSubmit({
      columnId: selectedColumn,
      title: trimmed,
      description: description.trim() || null,
      label: label.trim() || null,
      dueDate: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#120d1f]/45 p-4 pt-[8vh] backdrop-blur-[2px] sm:items-center sm:pt-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Yeni kart" : "Kart detayı"}
    >
      <form
        onSubmit={submit}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-panel p-5 shadow-[0_30px_80px_-40px_rgba(60,40,100,0.6)]"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1"
          style={{
            backgroundImage: "linear-gradient(90deg, #a9d2ff, #ffb3d9, #ffe49a)",
          }}
        />
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl text-strong">
            {mode === "create" ? "Yeni kart" : "Kart detayı"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-muted hover:bg-strong/10 hover:text-strong"
            aria-label="Kapat (Esc)"
          >
            <svg viewBox="0 0 16 16" className="size-4 fill-current">
              <path d="M3.7 3.7a.9.9 0 0 1 1.3 0L8 6.7l3-3a.9.9 0 1 1 1.3 1.3L9.3 8l3 3a.9.9 0 0 1-1.3 1.3L8 9.3l-3 3a.9.9 0 0 1-1.3-1.3l3-3-3-3a.9.9 0 0 1 0-1.3Z" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          <div>
            <label
              htmlFor="card-title"
              className="mb-1 block text-[11.5px] font-medium text-muted"
            >
              Başlık
            </label>
            <input
              id="card-title"
              ref={titleRef}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(null);
              }}
              placeholder="Örn. Sürükle-bırak testi"
              className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13.5px] text-strong placeholder:text-muted/50 focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="card-description"
              className="mb-1 block text-[11.5px] font-medium text-muted"
            >
              Açıklama
            </label>
            <textarea
              id="card-description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Kartın ayrıntısı…"
              className="w-full resize-y rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] leading-relaxed text-strong placeholder:text-muted/50 focus:border-accent/60 focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="card-label"
                className="mb-1 block text-[11.5px] font-medium text-muted"
              >
                Etiket
              </label>
              <input
                id="card-label"
                list="label-options"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="ör. frontend"
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-strong placeholder:text-muted/50 focus:border-accent/60 focus:outline-none"
              />
              <datalist id="label-options">
                {labels.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </div>

            <div>
              <label
                htmlFor="card-due"
                className="mb-1 block text-[11.5px] font-medium text-muted"
              >
                Son tarih
              </label>
              <input
                id="card-due"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-strong focus:border-accent/60 focus:outline-none"
              />
            </div>
          </div>

          {mode === "create" && (
            <div>
              <label
                htmlFor="card-column"
                className="mb-1 block text-[11.5px] font-medium text-muted"
              >
                Kolon
              </label>
              <select
                id="card-column"
                value={selectedColumn}
                onChange={(event) => setSelectedColumn(event.target.value)}
                className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-[13px] text-strong focus:border-accent/60 focus:outline-none"
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-[12px] text-danger">
              {error}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <div>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg px-2.5 py-1.5 text-[12px] text-danger/90 transition hover:bg-danger/10 hover:text-danger"
              >
                Kartı sil
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-[12.5px] text-muted transition hover:bg-strong/5 hover:text-strong"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={busy}
              className="btn-primary rounded-lg px-4 py-1.5 text-[12.5px] font-semibold disabled:opacity-50"
            >
              {mode === "create" ? "Kartı ekle" : "Değişiklikleri kaydet"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
