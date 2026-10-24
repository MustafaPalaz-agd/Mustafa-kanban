import { getTheme } from "../lib/themes";

type Props = { themeId: string };

/** Temanın fotoğrafını, okunabilirlik için perdeyle birlikte arkaya yerleştirir. */
export default function ThemeBackdrop({ themeId }: Props) {
  const theme = getTheme(themeId);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        key={theme.id}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${theme.photo})`,
          filter: "blur(2px) saturate(1.06)",
          transform: "scale(1.06)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--photo-veil)" }}
      />
    </div>
  );
}
