import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "../api/types";
import CardView from "./CardView";

type Props = {
  card: Card;
  columnId: string;
  onOpen: (card: Card, columnId: string) => void;
};

export default function SortableCard({ card, columnId, onOpen }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", columnId, cardId: card.id },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "opacity-30" : ""}
      {...attributes}
      {...listeners}
    >
      <CardView card={card} onOpen={() => onOpen(card, columnId)} />
    </div>
  );
}
