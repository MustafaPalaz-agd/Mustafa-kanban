import type { Card } from "../api/types";
import { formatDue, isOverdue } from "../lib/date";
import { labelTone } from "../lib/labels";

type Props = {
  card: Card;
  onOpen?: () => void;
  dragging?: boolean;
};

export default function CardView({ card, onOpen, dragging = false }: Props) {
  const overdue = isOverdue(card.dueDate);
  const tone = card.label ? labelTone(card.label) : null;

  return (
    <article
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen?.();
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      title={card.title}
      style={
        tone
          ? {
              borderLeftColor: tone,
              borderLeftWidth: 3,
              borderLeftStyle: "solid",
            }
          : undefined
      }
      className={[
        "paper-card group relative w-full cursor-grab overflow-hidden rounded-[10px]",
        "border border-cardink/10 px-3 py-2.5 text-cardink transition",
        dragging
          ? "rotate-[1.5deg] cursor-grabbing shadow-[0_24px_50px_-18px_rgba(70,50,110,0.55)]"
          : "hover:-translate-y-px hover:border-cardink/20",
      ].join(" ")}
    >
      {card.label && (
        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-cardink/[0.05] px-2 py-0.5 text-[10.5px] leading-none font-medium tracking-wide text-cardink/75">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: labelTone(card.label) }}
          />
          {card.label}
        </span>
      )}

      <h4 className="line-clamp-4 text-[13.5px] leading-snug font-semibold break-words">
        {card.title}
      </h4>

      {card.description && (
        <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug break-words text-cardink/55">
          {card.description}
        </p>
      )}

      {card.dueDate && (
        <div
          className={[
            "mt-2 flex items-center gap-1 text-[10.5px] font-medium",
            overdue ? "text-danger" : "text-cardink/50",
          ].join(" ")}
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-3 fill-current">
            <path d="M5 1.5a.75.75 0 0 1 .75.75V3h4.5V2.25a.75.75 0 0 1 1.5 0V3h.75A1.5 1.5 0 0 1 14 4.5v8A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-8A1.5 1.5 0 0 1 3.5 3h.75V2.25A.75.75 0 0 1 5 1.5ZM3.5 6v6.5h9V6h-9Z" />
          </svg>
          <span>{formatDue(card.dueDate)}</span>
          {overdue && <span className="font-semibold">gecikti</span>}
        </div>
      )}
    </article>
  );
}
