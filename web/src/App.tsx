import { useQuery } from "@tanstack/react-query";

type Health = { status: string };

async function fetchHealth(): Promise<Health> {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<Health>;
}

export default function App() {
  const health = useQuery({ queryKey: ["health"], queryFn: fetchHealth });

  return (
    <div className="min-h-full p-6">
      <header className="mb-6 flex items-baseline justify-between border-b border-line pb-4">
        <h1 className="text-xl font-semibold tracking-tight">Kanban</h1>
        <span className="text-xs text-muted">Faz 1 · iskele</span>
      </header>

      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="text-sm text-muted">API durumu</p>
        {health.isPending && (
          <p className="mt-1 text-sm">Yükleniyor…</p>
        )}
        {health.isError && (
          <p className="mt-1 text-sm text-red-400">
            API'ye ulaşılamadı: {(health.error as Error).message}
          </p>
        )}
        {health.data && (
          <p className="mt-1 text-sm text-accent">
            Bağlı · {health.data.status}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        Pano görünümü Faz 3'te gelecek. Vite proxy → :3001 çalışıyor.
      </p>
    </div>
  );
}
