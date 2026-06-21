import { Button } from 'netlabuz';
import { ArrowRight } from 'lucide-react';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button>Ro'yxatdan o'tish</Button>
    <Button variant="accent">Bepul konsultatsiya</Button>
    <Button variant="outline">Batafsil</Button>
    <Button variant="ghost">Bekor qilish</Button>
    <Button variant="link">Ko'proq</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="sm">Kichik</Button>
    <Button size="default">Oddiy</Button>
    <Button size="lg">Katta</Button>
  </div>
);

export const WithIcon = () => (
  <Button variant="accent" size="lg">
    Kurslarni ko'rish <ArrowRight />
  </Button>
);

export const Disabled = () => <Button disabled>O'chirilgan</Button>;
