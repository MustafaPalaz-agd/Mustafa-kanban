import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "../db";
import { badRequest, notFound } from "../lib/errors";
import {
  cardCreateSchema,
  cardPatchSchema,
  firstIssue,
  moveSchema,
} from "../lib/schemas";
import {
  findCard,
  findColumn,
  listCardIds,
  nextCardPosition,
  toCardWithColumn,
} from "../lib/board";
import { fold, toCard } from "../lib/mapper";

export const cardsRouter = Router();

/** GET /api/cards?q=&label= — metin ve etiket filtresi birlikte (AND). */
cardsRouter.get("/", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const label =
    typeof req.query.label === "string" ? req.query.label.trim() : "";

  const rows = db
    .prepare(
      `SELECT c.* FROM cards c
       JOIN columns col ON col.id = c.column_id
       ORDER BY col.position ASC, c.position ASC`,
    )
    .all() as Parameters<typeof toCard>[0][];

  const needle = fold(q);
  const labelNeedle = fold(label);

  const cards = rows
    .filter((row) => {
      if (needle) {
        const haystack = `${fold(row.title)}\n${fold(row.description ?? "")}`;
        if (!haystack.includes(needle)) return false;
      }
      if (labelNeedle) {
        if (!fold(row.label ?? "").includes(labelNeedle)) return false;
      }
      return true;
    })
    .map(toCardWithColumn);

  res.status(200).json({ cards });
});

cardsRouter.post("/", (req, res) => {
  const parsed = cardCreateSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest(firstIssue(parsed.error));

  const data = parsed.data;
  if (!findColumn(data.columnId)) throw notFound("Kolon bulunamadı");

  const id = randomUUID();
  db.prepare(
    `INSERT INTO cards (id, column_id, title, description, label, due_date, position)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    data.columnId,
    data.title,
    data.description ?? null,
    data.label ?? null,
    data.dueDate || null,
    nextCardPosition(data.columnId),
  );

  res.status(201).json(toCard(findCard(id)!));
});

cardsRouter.patch("/:id", (req, res) => {
  const id = String(req.params.id);
  if (!findCard(id)) throw notFound("Kart bulunamadı");

  const parsed = cardPatchSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest(firstIssue(parsed.error));

  const data = parsed.data;
  const fields: string[] = [];
  const values: Array<string | null> = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }
  if (data.label !== undefined) {
    fields.push("label = ?");
    values.push(data.label);
  }
  if (data.dueDate !== undefined) {
    fields.push("due_date = ?");
    values.push(data.dueDate || null);
  }

  if (fields.length > 0) {
    db.prepare(`UPDATE cards SET ${fields.join(", ")} WHERE id = ?`).run(
      ...values,
      id,
    );
  }

  res.status(200).json(toCard(findCard(id)!));
});

cardsRouter.delete("/:id", (req, res) => {
  const id = String(req.params.id);
  const card = findCard(id);
  if (!card) throw notFound("Kart bulunamadı");

  db.prepare("DELETE FROM cards WHERE id = ?").run(id);

  const remaining = listCardIds(card.column_id);
  const update = db.prepare("UPDATE cards SET position = ? WHERE id = ?");
  remaining.forEach((cardId, index) => update.run(index, cardId));

  res.status(204).end();
});

/** POST /api/cards/:id/move — sıralar 0..n-1 olarak yeniden hesaplanır. */
cardsRouter.post("/:id/move", (req, res) => {
  const id = String(req.params.id);

  // Gövde doğrulaması önce: toColumnId yoksa kart var olsa da olmasa da 400.
  const parsed = moveSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest(firstIssue(parsed.error));

  const card = findCard(id);
  if (!card) throw notFound("Kart bulunamadı");

  const { toColumnId, toIndex } = parsed.data;
  if (!findColumn(toColumnId)) throw notFound("Hedef kolon bulunamadı");

  const sourceColumnId = card.column_id;

  db.exec("BEGIN");
  try {
    const targetIds = listCardIds(toColumnId).filter((cardId) => cardId !== id);
    const index = Math.min(Math.max(toIndex, 0), targetIds.length);
    targetIds.splice(index, 0, id);

    if (sourceColumnId !== toColumnId) {
      const sourceIds = listCardIds(sourceColumnId).filter(
        (cardId) => cardId !== id,
      );
      const updateSource = db.prepare(
        "UPDATE cards SET position = ? WHERE id = ?",
      );
      sourceIds.forEach((cardId, position) =>
        updateSource.run(position, cardId),
      );
    }

    const updateTarget = db.prepare(
      "UPDATE cards SET column_id = ?, position = ? WHERE id = ?",
    );
    targetIds.forEach((cardId, position) =>
      updateTarget.run(toColumnId, position, cardId),
    );

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  res.status(200).json(toCard(findCard(id)!));
});
