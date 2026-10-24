import { z } from "zod";

const title = z
  .string({ error: "title metin olmalı" })
  .trim()
  .min(1, "title zorunlu");

const nullableText = z.string().nullable().optional();

const dueDate = z
  .string()
  .nullable()
  .optional()
  .refine(
    (v) => v == null || v === "" || !Number.isNaN(Date.parse(v)),
    "dueDate geçerli bir ISO tarih olmalı",
  );

export const columnCreateSchema = z.object({
  title,
  order: z.number().int().min(0).optional(),
});

export const columnPatchSchema = z.object({
  title: title.optional(),
  order: z.number().int().min(0).optional(),
});

export const cardCreateSchema = z.object({
  columnId: z
    .string({ error: "columnId zorunlu" })
    .min(1, "columnId zorunlu"),
  title,
  description: nullableText,
  label: nullableText,
  dueDate,
});

export const cardPatchSchema = z.object({
  title: title.optional(),
  description: nullableText,
  label: nullableText,
  dueDate,
});

export const moveSchema = z.object({
  toColumnId: z
    .string({ error: "toColumnId zorunlu" })
    .min(1, "toColumnId zorunlu"),
  toIndex: z
    .number({ error: "toIndex sayı olmalı" })
    .int("toIndex tam sayı olmalı")
    .min(0, "toIndex negatif olamaz"),
});

const importCardSchema = z.object({
  id: z.string().optional(),
  title,
  description: nullableText,
  label: nullableText,
  dueDate,
  order: z.number().optional(),
});

const importColumnSchema = z.object({
  id: z.string().optional(),
  title,
  order: z.number().optional(),
  cards: z.array(importCardSchema).default([]),
});

export const importSchema = z.object({
  board: z
    .object({ columns: z.array(importColumnSchema) })
    .optional(),
  columns: z.array(importColumnSchema).optional(),
});

export type ColumnCreate = z.infer<typeof columnCreateSchema>;
export type ColumnPatch = z.infer<typeof columnPatchSchema>;
export type CardCreate = z.infer<typeof cardCreateSchema>;
export type CardPatch = z.infer<typeof cardPatchSchema>;
export type MoveInput = z.infer<typeof moveSchema>;
export type ImportColumn = z.infer<typeof importColumnSchema>;

/** zod hatasını tek satırlık kullanıcı mesajına çevirir. */
export function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Geçersiz istek";
  const path = issue.path.join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}
