import { Router } from "express";
import { randomUUID } from "node:crypto";
import { db } from "../db";
import { badRequest, notFound } from "../lib/errors";
import {
  columnCreateSchema,
  columnPatchSchema,
  firstIssue,
} from "../lib/schemas";
import {
  columnWithCards,
  compactColumnPositions,
  findColumn,
  listColumnIds,
  nextColumnPosition,
} from "../lib/board";

export const columnsRouter = Router();

function moveColumnToIndex(id: string, targetIndex: number): void {
  const ids = listColumnIds().filter((columnId) => columnId !== id);
  const index = Math.max(0, Math.min(targetIndex, ids.length));
  ids.splice(index, 0, id);
  const update = db.prepare("UPDATE columns SET position = ? WHERE id = ?");
  ids.forEach((columnId, position) => update.run(position, columnId));
}

columnsRouter.post("/", (req, res) => {
  const parsed = columnCreateSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest(firstIssue(parsed.error));

  const id = randomUUID();
  const position = nextColumnPosition();
  db.prepare("INSERT INTO columns (id, title, position) VALUES (?, ?, ?)").run(
    id,
    parsed.data.title,
    position,
  );

  if (parsed.data.order !== undefined) {
    moveColumnToIndex(id, parsed.data.order);
  }

  res.status(201).json(columnWithCards(id));
});

columnsRouter.patch("/:id", (req, res) => {
  const id = String(req.params.id);
  const column = findColumn(id);
  if (!column) throw notFound("Kolon bulunamadı");

  const parsed = columnPatchSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest(firstIssue(parsed.error));

  if (parsed.data.title !== undefined) {
    db.prepare("UPDATE columns SET title = ? WHERE id = ?").run(
      parsed.data.title,
      id,
    );
  }
  if (parsed.data.order !== undefined) {
    moveColumnToIndex(id, parsed.data.order);
  }

  res.status(200).json(columnWithCards(id));
});

columnsRouter.delete("/:id", (req, res) => {
  const id = String(req.params.id);
  if (!findColumn(id)) throw notFound("Kolon bulunamadı");

  db.prepare("DELETE FROM columns WHERE id = ?").run(id);
  compactColumnPositions();

  res.status(204).end();
});
