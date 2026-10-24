import { Router } from "express";
import { badRequest } from "../lib/errors";
import { getBoard, replaceBoard } from "../lib/board";
import { firstIssue, importSchema } from "../lib/schemas";

export const dataRouter = Router();

dataRouter.get("/board", (_req, res) => {
  res.status(200).json(getBoard());
});

dataRouter.get("/export", (_req, res) => {
  res.status(200).json({ board: getBoard() });
});

dataRouter.post("/import", (req, res) => {
  const parsed = importSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest(firstIssue(parsed.error));

  const columns = parsed.data.board?.columns ?? parsed.data.columns;
  if (!columns) throw badRequest("board veya columns zorunlu");

  try {
    const result = replaceBoard({ columns });
    res.status(200).json({ ok: true, ...result });
  } catch (error) {
    throw badRequest(
      `import başarısız: ${error instanceof Error ? error.message : "bilinmeyen hata"}`,
    );
  }
});
