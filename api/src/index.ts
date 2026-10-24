import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { ApiError } from "./lib/errors";
import { seedIfEmpty } from "./lib/board";
import { columnsRouter } from "./routes/columns";
import { cardsRouter } from "./routes/cards";
import { dataRouter } from "./routes/data";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/columns", columnsRouter);
app.use("/api/cards", cardsRouter);
app.use("/api", dataRouter);

// Bilinmeyen /api yolu -> aynı hata zarfı
app.use("/api", (_req, res) => {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Bu uç nokta yok" },
  });
});

// Merkezi hata zarfı: her hata { error: { code, message } }
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Gövde geçerli JSON değil" },
    });
    return;
  }

  const status =
    typeof err === "object" && err !== null && "status" in err
      ? Number((err as { status: number }).status) || 500
      : 500;
  const message =
    err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu";

  console.error("[api]", err);
  res.status(status).json({
    error: { code: "INTERNAL_ERROR", message },
  });
});

const PORT = 3001;

const seeded = seedIfEmpty();

app.listen(PORT, () => {
  console.log(
    `[api] http://localhost:${PORT} hazir${seeded ? " (data/board.json yuklendi)" : ""}`,
  );
});
