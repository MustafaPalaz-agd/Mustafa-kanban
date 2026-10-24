import { readFileSync } from "node:fs";
import { BOARD_JSON_PATH } from "./db";
import { replaceBoard } from "./lib/board";

const raw = JSON.parse(readFileSync(BOARD_JSON_PATH, "utf8")) as
  | { columns: Array<{ title: string }> }
  | { board: { columns: Array<{ title: string }> } };

const board = "board" in raw ? raw.board : raw;
const result = replaceBoard(board as Parameters<typeof replaceBoard>[0]);

console.log(
  `[seed] ${result.columns} kolon, ${result.cards} kart yazıldı -> api/data/kanban.sqlite`,
);
