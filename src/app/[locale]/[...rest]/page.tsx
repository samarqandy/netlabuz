import { notFound } from 'next/navigation';

// Locale ichidagi mavjud bo'lmagan barcha yo'llar — [locale]/not-found.tsx
export default function CatchAllPage() {
  notFound();
}
