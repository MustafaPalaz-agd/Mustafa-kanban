import express from "express";
import cors from "cors";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Bilinmeyen /api yolu -> ayni hata zarfi
app.use("/api", (_req, res) => {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Bu uç nokta yok" },
  });
});

// Merkezi hata zarfi: her hata { error: { code, message } }
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status: number }).status) || 500
        : 500;
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code: string }).code)
        : "INTERNAL_ERROR";
    const message =
      err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu";
    res.status(status).json({ error: { code, message } });
  },
);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`[api] http://localhost:${PORT} hazir`);
});
