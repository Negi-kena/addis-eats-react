export function formatOrderDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (isToday) return `Today · ${time}`;
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${dateLabel} · ${time}`;
}