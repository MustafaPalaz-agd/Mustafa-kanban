import { THEMES } from "../lib/themes";

type Props = {
  value: string;
  onChange: (id: string) => void;
};

export default function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {THEMES.map((theme) => {
        const selected = theme.id === value;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            aria-pressed={selected}
            className={[
              "group relative overflow-hidden rounded-xl border p-0 text-left transition",
              selected
                ? "border-transparent ring-2 ring-[var(--color-focus)]"
                : "border-line hover:border-[var(--color-focus)]/50",
            ].join(" ")}
          >
            <span
              aria-hidden
              className="block h-12 w-full"
              style={{
                backgroundImage: `linear-gradient(115deg, ${theme.preview[0]}, ${theme.preview[1]} 52%, ${theme.preview[2]})`,
              }}
            />
            <span className="block bg-panel px-2.5 py-2">
              <span className="block text-[12px] font-semibold text-strong">
                {theme.name}
              </span>
              <span className="mt-0.5 block text-[10.5px] leading-snug text-muted">
                {theme.tagline}
              </span>
            </span>

            {selected && (
              <span
                aria-hidden
                className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#241f36] shadow"
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
