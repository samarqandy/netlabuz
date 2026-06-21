// DS preview CSS kompilyatsiyasi uchun Tailwind config — asosiy configdan
// theme/plugin'larni meros qiladi, faqat content (skanerlanadigan fayllar) o'zgaradi.
import base from '../tailwind.config';

const config = {
  ...base,
  content: [
    './src/components/**/*.{ts,tsx}',
    './.design-sync/previews/**/*.{ts,tsx}',
    './.design-sync/entry.tsx',
  ],
};

export default config;
