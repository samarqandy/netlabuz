import { Input, Label } from 'netlabuz';

export const Default = () => (
  <div style={{ maxWidth: 320 }}>
    <Input placeholder="Ismingiz" />
  </div>
);

export const WithLabel = () => (
  <div style={{ maxWidth: 320, display: 'grid', gap: 6 }}>
    <Label htmlFor="phone">Telefon</Label>
    <Input id="phone" type="tel" placeholder="+998 90 123 45 67" />
  </div>
);

export const Invalid = () => (
  <div style={{ maxWidth: 320 }}>
    <Input aria-invalid defaultValue="abc" />
  </div>
);

export const Disabled = () => (
  <div style={{ maxWidth: 320 }}>
    <Input disabled placeholder="O'chirilgan maydon" />
  </div>
);
