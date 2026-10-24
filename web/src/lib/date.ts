export function isOverdue(due: string | null): boolean {
  if (!due) return false;
  const date = new Date(due);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export function formatDue(due: string | null): string {
  if (!due) return "";
  const date = new Date(due);
  if (Number.isNaN(date.getTime())) return due;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

/** ISO tarih -> <input type="date"> değeri (yerel saat). */
export function toDateInput(due: string | null): string {
  if (!due) return "";
  const date = new Date(due);
  if (Number.isNaN(date.getTime())) return "";
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
