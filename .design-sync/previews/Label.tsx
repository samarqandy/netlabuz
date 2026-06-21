import { Label, Input } from 'netlabuz';

export const Default = () => (
  <div style={{ display: 'grid', gap: 6, maxWidth: 320 }}>
    <Label htmlFor="email">Email manzil</Label>
    <Input id="email" type="email" placeholder="email@example.com" />
  </div>
);
