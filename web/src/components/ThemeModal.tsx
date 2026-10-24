import { useEffect } from "react";
import ThemePicker from "./ThemePicker";

type Props = {
  value: string;
  onChange: (id: string) => void;
  onClose: () => void;
};

export default function ThemeModal({ value, onChange, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#120d1f]/45 p-4 pt-[8vh] backdrop-blur-[2px] sm:items-center sm:pt-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Tema seç"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel p-5 shadow-[0_30px_80px_-40px_rgba(60,40,100,0.6)]">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundImage: "var(--btn-grad)" }}
        />

        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-strong">Tema</h2>
            <p className="mt-1 text-[12.5px] text-muted">
              Seçtiğin tema anında uygulanır ve bu tarayıcıda hatırlanır.
            </p>
          </div>
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

        <div className="mt-4">
          <ThemePicker value={value} onChange={onChange} />
        </div>

        <div className="mt-5 flex justify-end border-t border-line pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary rounded-lg px-4 py-1.5 text-[12.5px] font-semibold"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
