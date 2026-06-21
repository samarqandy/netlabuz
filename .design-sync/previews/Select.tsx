import { Select, Label } from 'netlabuz';

export const Default = () => (
  <div style={{ maxWidth: 320 }}>
    <Select defaultValue="cisco">
      <option value="" disabled>
        Kursni tanlang
      </option>
      <option value="computer">Kompyuter savodxonligi</option>
      <option value="cisco">Cisco / MikroTik tarmoqlar</option>
      <option value="linux">Linux administratsiya</option>
      <option value="iot">Aqlli uy & IoT</option>
    </Select>
  </div>
);

export const WithLabel = () => (
  <div style={{ maxWidth: 320, display: 'grid', gap: 6 }}>
    <Label htmlFor="course">Yo'nalish</Label>
    <Select id="course" defaultValue="linux">
      <option value="cisco">Cisco</option>
      <option value="linux">Linux</option>
      <option value="security">Xavfsizlik & video nazorat</option>
    </Select>
  </div>
);
