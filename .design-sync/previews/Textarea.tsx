import { Textarea, Label } from 'netlabuz';

export const Default = () => (
  <div style={{ maxWidth: 360 }}>
    <Textarea placeholder="Xabaringiz..." />
  </div>
);

export const WithLabel = () => (
  <div style={{ maxWidth: 360, display: 'grid', gap: 6 }}>
    <Label htmlFor="msg">Izoh</Label>
    <Textarea id="msg" rows={4} defaultValue="Cisco kursi haqida ko'proq bilmoqchiman." />
  </div>
);
