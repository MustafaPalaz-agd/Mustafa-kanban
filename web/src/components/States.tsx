type Props = {
  onRetry: () => void;
  message?: string;
};

export function LoadingState() {
  return (
    <div className="flex gap-3 px-4 pt-1 pb-5 sm:gap-4" aria-busy="true">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="w-[300px] shrink-0 rounded-xl border border-line/60 bg-panel/60 p-3 sm:w-[320px]"
        >
          <div className="mb-3 h-3 w-24 animate-pulse rounded bg-strong/10" />
          {[0, 1, 2].map((card) => (
            <div
              key={card}
              className="mb-2 h-16 animate-pulse rounded-lg bg-strong/[0.06]"
            />
          ))}
        </div>
      ))}
      <span className="sr-only">Pano yükleniyor</span>
    </div>
  );
}

export function ErrorState({
  onRetry,
  message = "Pano yüklenemedi.",
}: Props) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border border-danger/40 bg-danger/[0.06] p-5">
      <h2 className="font-display text-lg text-strong">Pano yüklenemedi</h2>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
        {message} API sunucusu <span className="font-mono">:3001</span>{" "}
        portunda çalışıyor olmalı. Terminalde <code>npm run dev</code> açık
        mı?
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-primary mt-4 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold"
      >
        Tekrar dene
      </button>
    </div>
  );
}

export function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border border-line p-5 text-center">
      <p className="text-[13px] text-strong">Bu filtreyle eşleşen kart yok.</p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
        Arama metnini kısaltmayı ya da etiket filtresini kaldırmayı dene.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 rounded-lg border border-line px-3 py-1.5 text-[12px] text-strong hover:border-accent/50"
      >
        Filtreyi temizle
      </button>
    </div>
  );
}
