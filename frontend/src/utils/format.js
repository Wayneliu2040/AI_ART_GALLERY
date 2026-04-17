export function formatDate(value) {
  return new Intl.DateTimeFormat('en-NZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}
