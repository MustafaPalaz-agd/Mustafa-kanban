import { getTheme } from "../lib/themes";

type Props = {
  themeId: string;
  onCreate: () => void;
};

export default function WelcomeScreen({ themeId, onCreate }: Props) {
  const theme = getTheme(themeId);

  return (
    <div className="flex h-full items-center justify-center px-5 py-10">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-panel/70 p-7 shadow-[0_30px_80px_-50px_rgba(60,40,100,0.55)] backdrop-blur">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ backgroundImage: "var(--btn-grad)" }}
          />

          <p className="text-[11.5px] text-muted">Kanban panosu</p>
          <h1 className="grad-text mt-2 font-display text-4xl leading-none">
            Tahta
          </h1>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
            Ortada henüz bir tablo yok. Yeni bir tablo oluştur, temasını seç ve
            kartlarını sürüklemeye başla. Her şey sunucuda saklanır.
          </p>

          <div aria-hidden className="mt-6 flex gap-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-24 flex-1 rounded-xl border border-line/80"
                style={{
                  backgroundImage: `var(--wash-${index})`,
                }}
              >
                <span
                  className="block h-[3px] w-full rounded-t-xl"
                  style={{ backgroundImage: `var(--top-${index})` }}
                />
                <span className="mt-3 ml-3 block h-2 w-10 rounded-full bg-strong/10" />
                <span className="mt-2 ml-3 block h-2 w-14 rounded-full bg-strong/[0.07]" />
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCreate}
              className="btn-primary rounded-xl px-5 py-2.5 text-[13.5px] font-semibold"
            >
              Yeni tablo oluştur
            </button>
            <span className="text-[11.5px] text-muted">
              Aktif tema: {theme.name}
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted/80">
          Tablo oluşturduktan sonra temayı üst çubuktan değiştirebilirsin.
        </p>
      </div>
    </div>
  );
}
