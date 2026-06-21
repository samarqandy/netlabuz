import { Badge } from 'netlabuz';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
    <Badge>Yangi</Badge>
    <Badge variant="accent">Mashhur</Badge>
    <Badge variant="cyan">Pro</Badge>
    <Badge variant="outline">Arxiv</Badge>
  </div>
);

export const CourseLevels = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
    <Badge variant="beginner">Boshlang'ich</Badge>
    <Badge variant="intermediate">O'rta</Badge>
    <Badge variant="advanced">Yuqori</Badge>
  </div>
);
