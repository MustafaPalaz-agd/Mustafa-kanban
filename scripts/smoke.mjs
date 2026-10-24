#!/usr/bin/env node
/**
 * Sozlesme testi — 12 uc nokta + move invariant.
 * Kullanim: sunucu acikken  ->  npm run smoke
 * Cikis kodu 0 = hepsi gecti, 1 = en az bir madde kirdi.
 */
const BASE = process.env.API_URL ?? "http://localhost:3001";

let pass = 0;
const failures = [];

function ok(name, cond, detail = "") {
  if (cond) {
    pass++;
    console.log(`  \x1b[32mok\x1b[0m   ${name}`);
  } else {
    failures.push(name);
    console.log(`  \x1b[31mFAIL\x1b[0m ${name}${detail ? `  -> ${detail}` : ""}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { status: res.status, data };
}

const isEnvelope = (d) =>
  !!d && typeof d === "object" && d.error && typeof d.error.code === "string" &&
  typeof d.error.message === "string";

const seq = (arr) => arr.every((v, i) => v === i);
const positions = (col) => (col?.cards ?? []).map((c) => c.order);

async function main() {
  console.log(`Smoke: ${BASE}`);

  const backup = await req("GET", "/api/export");

  try {
    // ---------- B1 ----------
    section("B1 · health");
    const h = await req("GET", "/api/health");
    ok("GET /api/health -> 200", h.status === 200, `status=${h.status}`);
    ok('govde {"status":"ok"}', h.data?.status === "ok", JSON.stringify(h.data));

    // ---------- B2 ----------
    section("B2 · pano semasi");
    const board = await req("GET", "/api/board");
    ok("GET /api/board -> 200", board.status === 200, `status=${board.status}`);
    const cols = board.data?.columns;
    ok("columns bir dizi", Array.isArray(cols), typeof cols);
    if (Array.isArray(cols)) {
      ok("her kolonda id/title/order/cards", cols.every((c) =>
        typeof c.id === "string" && typeof c.title === "string" &&
        typeof c.order === "number" && Array.isArray(c.cards)));
      const cardKeys = ["id", "title", "description", "label", "dueDate", "order"];
      const allCards = cols.flatMap((c) => c.cards);
      ok("kart alan adlari birebir", allCards.every((c) =>
        cardKeys.every((k) => k in c) && !("column_id" in c) && !("due_date" in c)),
        allCards[0] ? JSON.stringify(Object.keys(allCards[0])) : "kart yok");
      ok("kolonlar order'a gore sirali", cols.every((c, i) => i === 0 || cols[i - 1].order <= c.order));
      ok("kart order'lari kolon icinde 0..n-1",
        cols.every((c) => seq(positions(c)) || c.cards.every((x) => typeof x.order === "number")));
    }

    // ---------- B7 ----------
    section("B7 · dogrulama ve hata zarfi");
    const e1 = await req("POST", "/api/columns", {});
    ok("POST /api/columns {} -> 400", e1.status === 400, `status=${e1.status}`);
    ok("hata zarfi {error:{code,message}}", isEnvelope(e1.data), JSON.stringify(e1.data));

    const e2 = await req("POST", "/api/columns", { title: "   " });
    ok("bosluk baslik -> 400", e2.status === 400, `status=${e2.status}`);

    const e3 = await req("POST", "/api/cards", { title: "x" });
    ok("columnId yok -> 400", e3.status === 400, `status=${e3.status}`);

    const e4 = await req("PATCH", "/api/cards/yok-boyle-id", { title: "x" });
    ok("PATCH olmayan kart -> 404", e4.status === 404, `status=${e4.status}`);
    ok("404 kodu NOT_FOUND", e4.data?.error?.code === "NOT_FOUND", JSON.stringify(e4.data));

    const e5 = await req("DELETE", "/api/columns/yok-boyle-id");
    ok("DELETE olmayan kolon -> 404", e5.status === 404, `status=${e5.status}`);

    const e6 = await req("POST", "/api/cards/yok-boyle-id/move", { toIndex: 99 });
    ok("move toColumnId yok -> 400", e6.status === 400, `status=${e6.status}`);

    // ---------- B3 ----------
    section("B3 · kolon uclari + cascade");
    const c1 = await req("POST", "/api/columns", { title: "Smoke Kolon A" });
    ok("POST kolon -> 201", c1.status === 201, `status=${c1.status}`);
    const colA = c1.data?.id;
    ok("kolon id dondu", typeof colA === "string" && colA.length > 0, JSON.stringify(c1.data));

    const c2 = await req("PATCH", `/api/columns/${colA}`, { title: "Smoke Kolon A2" });
    ok("PATCH kolon -> 200", c2.status === 200, `status=${c2.status}`);
    ok("baslik guncellendi", c2.data?.title === "Smoke Kolon A2", c2.data?.title);

    const c3 = await req("POST", "/api/columns", { title: "Smoke Cascade" });
    const colCascade = c3.data?.id;
    const cc1 = await req("POST", "/api/cards", {
      columnId: colCascade,
      title: "cascade-kart-" + Date.now(),
    });
    const cascadeCardId = cc1.data?.id;
    ok("cascade icin kart olustu", cc1.status === 201, `status=${cc1.status}`);
    const c4 = await req("DELETE", `/api/columns/${colCascade}`);
    ok("DELETE kolon -> 204", c4.status === 204, `status=${c4.status}`);
    const afterCascade = await req("GET", "/api/cards?q=cascade-kart-");
    ok("kolon silinince kartlar gitti",
      Array.isArray(afterCascade.data?.cards) && afterCascade.data.cards.every((x) => x.id !== cascadeCardId),
      JSON.stringify(afterCascade.data));

    // ---------- B4 ----------
    section("B4 · kart uclari");
    const k1 = await req("POST", "/api/cards", {
      columnId: colA,
      title: "Smoke kart",
      description: "ilk aciklama",
      label: "smoke",
      dueDate: "2026-12-01T10:00:00.000Z",
    });
    ok("POST kart -> 201", k1.status === 201, `status=${k1.status}`);
    const cardId = k1.data?.id;

    const k2 = await req("PATCH", `/api/cards/${cardId}`, { title: "Smoke kart 2" });
    ok("PATCH kart -> 200", k2.status === 200, `status=${k2.status}`);
    ok("sadece gonderilen alan degisti",
      k2.data?.title === "Smoke kart 2" && k2.data?.description === "ilk aciklama",
      JSON.stringify(k2.data));

    const k3 = await req("PATCH", `/api/cards/${cardId}`, { description: null, label: null });
    ok("null ile temizleme calisiyor",
      k3.status === 200 && k3.data?.description === null && k3.data?.label === null,
      JSON.stringify(k3.data));

    // ---------- B5 ----------
    section("B5 · move + order invariant (7 puan)");
    // Temiz kolonlarda calis: ayni kolonda sira beklentisi deterministik olsun.
    const colM = (await req("POST", "/api/columns", { title: "Smoke Move A" })).data?.id;
    const colB = (await req("POST", "/api/columns", { title: "Smoke Kolon B" })).data?.id;
    const mk = async (columnId, title) => (await req("POST", "/api/cards", { columnId, title })).data?.id;
    const a1 = await mk(colM, "m1");
    const a2 = await mk(colM, "m2");
    const a3 = await mk(colM, "m3");

    const mv1 = await req("POST", `/api/cards/${a1}/move`, { toColumnId: colM, toIndex: 2 });
    ok("ayni kolonda move -> 200", mv1.status === 200, `status=${mv1.status}`);

    let b = (await req("GET", "/api/board")).data;
    const colNow = (id) =>
      b?.columns?.find((c) => c.id === id) ?? { cards: [], order: -1 };
    ok("ayni kolon icinde sira dogru",
      colNow(colM).cards.map((c) => c.id).join(",") === [a2, a3, a1].join(","),
      colNow(colM).cards.map((c) => c.id).join(","));
    ok("kaynak kolon order 0..n-1", seq(positions(colNow(colM))), JSON.stringify(positions(colNow(colM))));

    const mv2 = await req("POST", `/api/cards/${a1}/move`, { toColumnId: colB, toIndex: 0 });
    ok("kolonlar arasi move -> 200", mv2.status === 200, `status=${mv2.status}`);

    b = (await req("GET", "/api/board")).data;
    ok("hedef kolonda order 0..n-1", seq(positions(b?.columns?.find((c) => c.id === colB))),
      JSON.stringify(positions(b?.columns?.find((c) => c.id === colB))));
    ok("kaynak kolonda order 0..n-1", seq(positions(b?.columns?.find((c) => c.id === colM))),
      JSON.stringify(positions(b?.columns?.find((c) => c.id === colM))));
    ok("tum panoda order boşluksuz",
      Array.isArray(b?.columns) && b.columns.every((c) => seq(positions(c))),
      JSON.stringify(b?.columns?.map((c) => [c.id, positions(c)])));

    const mv3 = await req("POST", `/api/cards/${a1}/move`, { toColumnId: colB, toIndex: 999 });
    ok("aralik disi toIndex clamp (200)", mv3.status === 200, `status=${mv3.status}`);

    const mv4 = await req("POST", `/api/cards/yok-boyle-id/move`, { toColumnId: colB, toIndex: 0 });
    ok("olmayan kart move -> 404", mv4.status === 404, `status=${mv4.status}`);

    // ---------- B6 ----------
    section("B6 · arama + etiket filtresi (Turkce duyarsiz)");
    await req("POST", "/api/cards", { columnId: colA, title: "İstanbul Gezisi", label: "Şehir" });
    await req("POST", "/api/cards", { columnId: colA, title: "Ankara Toplantısı", label: "İş" });

    const s1 = await req("GET", "/api/cards?q=istanbul");
    ok("q=istanbul -> İstanbul bulundu",
      (s1.data?.cards ?? []).some((c) => c.title.includes("İstanbul")),
      JSON.stringify(s1.data?.cards?.map((c) => c.title)));
    const s2 = await req("GET", "/api/cards?q=ISTANBUL");
    ok("q=ISTANBUL -> ayni sonuc", (s2.data?.cards ?? []).length === (s1.data?.cards ?? []).length,
      `istanbul=${(s1.data?.cards ?? []).length} ISTANBUL=${(s2.data?.cards ?? []).length}`);
    const s3 = await req("GET", "/api/cards?label=şehir");
    ok("label=şehir -> filtre", (s3.data?.cards ?? []).some((c) => c.title.includes("İstanbul")),
      JSON.stringify(s3.data?.cards?.map((c) => c.title)));
    const s4 = await req("GET", "/api/cards?q=gezi&label=sehir");
    ok("q + label birlikte (AND)", (s4.data?.cards ?? []).length === 1,
      JSON.stringify(s4.data?.cards?.map((c) => c.title)));
    const s5 = await req("GET", "/api/cards?q=zzzz-yok");
    ok("sonuc yoksa bos dizi", Array.isArray(s5.data?.cards) && s5.data.cards.length === 0,
      JSON.stringify(s5.data));

    // ---------- B3 · kolon sırası ----------
    section("B3 · kolon sırası (PATCH order)");
    const orderBefore = (await req("GET", "/api/board")).data.columns.map((c) => c.id);
    const lastCol = orderBefore[orderBefore.length - 1];
    const reorder = await req("PATCH", `/api/columns/${lastCol}`, { order: 0 });
    ok("PATCH kolon order -> 200", reorder.status === 200, `status=${reorder.status}`);
    const orderAfter = (await req("GET", "/api/board")).data.columns;
    ok("kolon başa taşındı", orderAfter[0]?.id === lastCol, orderAfter.map((c) => c.id).join(","));
    ok("kolon order 0..n-1", seq(orderAfter.map((c) => c.order)), JSON.stringify(orderAfter.map((c) => c.order)));

    // ---------- B4 · kart silme sonrası sıkışma ----------
    section("B4 · kart silme sonrası sıra");
    const colCards = (await req("GET", "/api/board")).data.columns.find((c) => c.id === colA)?.cards ?? [];
    ok("silme öncesi kart var", colCards.length >= 2, `kart=${colCards.length}`);
    if (colCards.length >= 2) {
      const middle = colCards[Math.ceil(colCards.length / 2) - 1].id;
      const removed = await req("DELETE", `/api/cards/${middle}`);
      ok("DELETE kart -> 204", removed.status === 204, `status=${removed.status}`);
      const afterDelete = (await req("GET", "/api/board")).data.columns.find((c) => c.id === colA)?.cards ?? [];
      ok("silme sonrası order boşluksuz", seq(afterDelete.map((c) => c.order)), JSON.stringify(afterDelete.map((c) => c.order)));
    }

    // ---------- B7 · ek doğrulama ----------
    section("B7 · ek doğrulama");
    const blankColumn = await req("PATCH", `/api/columns/${colA}`, { title: "   " });
    ok("PATCH kolon boş başlık -> 400", blankColumn.status === 400, `status=${blankColumn.status}`);
    const tempCard = await req("POST", "/api/cards", { columnId: colA, title: "geçici doğrulama" });
    const blankCard = await req("PATCH", `/api/cards/${tempCard.data?.id}`, { title: "   " });
    ok("PATCH kart boş başlık -> 400", blankCard.status === 400, `status=${blankCard.status}`);
    const brokenJson = await fetch(BASE + "/api/columns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    ok("bozuk JSON -> 400", brokenJson.status === 400, `status=${brokenJson.status}`);

    // ---------- B5 · kenar taşımalar ----------
    section("B5 · kenar taşımalar");
    const unknownTarget = await req("POST", `/api/cards/${a2}/move`, { toColumnId: "yok-boyle-kolon", toIndex: 0 });
    ok("olmayan hedef kolon -> 404", unknownTarget.status === 404, `status=${unknownTarget.status}`);
    const toZero = await req("POST", `/api/cards/${a3}/move`, { toColumnId: colM, toIndex: 0 });
    ok("aynı kolonda index 0 -> 200", toZero.status === 200, `status=${toZero.status}`);
    const firstCard = (await req("GET", "/api/board")).data.columns.find((c) => c.id === colM)?.cards?.[0];
    ok("kart gerçekten başa geldi", firstCard?.id === a3, String(firstCard?.id));

    // ---------- B9 ----------
    section("B9 · import / export");
    ok("export {board:{...}} dondurur",
      !!backup.data?.board && Array.isArray(backup.data.board.columns),
      JSON.stringify(backup.data)?.slice(0, 80));

    const testBoard = {
      board: {
        columns: [
          { id: "imp-1", title: "Import A", order: 0, cards: [
            { id: "imp-c1", title: "İçe aktarılan", description: null, label: "test", dueDate: null, order: 0 },
          ] },
          { id: "imp-2", title: "Import B", order: 1, cards: [] },
        ],
      },
    };
    const imp = await req("POST", "/api/import", testBoard);
    ok("import -> 200", imp.status === 200, `status=${imp.status}`);
    const afterImport = await req("GET", "/api/board");
    ok("import mevcut veriyi temizledi",
      afterImport.data?.columns?.length === 2 &&
      afterImport.data.columns[0].cards.length === 1,
      JSON.stringify(afterImport.data?.columns?.map((c) => [c.title, c.cards.length])));

    const snapshotA = await req("GET", "/api/export");
    const reimport = await req("POST", "/api/import", snapshotA.data);
    const snapshotB = await req("GET", "/api/export");
    ok("export çıktısı import edilebilir", reimport.status === 200, `status=${reimport.status}`);
    ok("tur sonrası pano birebir aynı",
      JSON.stringify(snapshotA.data) === JSON.stringify(snapshotB.data));

    const badImport = await req("POST", "/api/import", { board: { columns: "x" } });
    ok("geçersiz import -> 400", badImport.status === 400, `status=${badImport.status}`);
    ok("geçersiz import hata zarfı", isEnvelope(badImport.data), JSON.stringify(badImport.data));

    // ---------- Ek kenar durumlar ----------
    section("Ek · kenar durumlar");
    // B9 import'u panoyu sildi; kenar testler kendi kolonunu kurar.
    const edgeCol = (await req("POST", "/api/columns", { title: "Kenar Test" })).data?.id;
    const badDue = await req("POST", "/api/cards", {
      columnId: edgeCol,
      title: "tarih testi",
      dueDate: "tarih-degil",
    });
    ok("geçersiz dueDate -> 400", badDue.status === 400, `status=${badDue.status}`);

    const duplicate = await req("POST", "/api/import", {
      board: {
        columns: [
          { id: "dup-1", title: "A", cards: [{ id: "dup-c", title: "kart" }] },
          { id: "dup-1", title: "B", cards: [] },
        ],
      },
    });
    ok("import çakışan id -> 400", duplicate.status === 400, `status=${duplicate.status}`);
    ok("çakışan id hata zarfı", isEnvelope(duplicate.data));

    const missingTitle = await req("POST", "/api/import", {
      board: { columns: [{ title: "   ", cards: [] }] },
    });
    ok("import boş kolon başlığı -> 400", missingTitle.status === 400, `status=${missingTitle.status}`);

    const descCard = await req("POST", "/api/cards", {
      columnId: edgeCol,
      title: "Açıklama testi",
      description: "içinde gizli anahtar kelime geçiyor",
      label: "etiket-test",
    });
    const descSearch = await req("GET", "/api/cards?q=anahtar");
    ok("q açıklamada da arıyor", (descSearch.data?.cards ?? []).some((c) => c.id === descCard.data?.id));
    const labelOnly = await req("GET", "/api/cards?label=ETIKET-TEST");
    ok("yalnız etiket filtresi (büyük harf)", (labelOnly.data?.cards ?? []).length === 1,
      JSON.stringify(labelOnly.data?.cards?.map((c) => c.title)));
  } finally {
    if (backup.data?.board) {
      const restored = await req("POST", "/api/import", backup.data);
      console.log(`\n(geri yukleme: ${restored.status === 200 ? "ok" : "HATA " + restored.status})`);
    }
  }

  console.log(`\n${failures.length === 0 ? "\x1b[32m" : "\x1b[31m"}%d geçti, %d kaldı\x1b[0m`,
    pass, failures.length);
  if (failures.length) console.log("Kırılanlar: " + failures.join(" | "));
  console.log("B8 (kalıcılık) elle: sunucuyu kapat-aç, pano aynı mı?");
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("\nSmoke çalıştırılamadı:", err.message);
  console.error("Sunucu :3001'de açık mı?  npm run dev");
  process.exit(1);
});
