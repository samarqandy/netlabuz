import { Reveal, StaggerGroup, StaggerItem } from 'netlabuz';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '12px 16px',
      border: '1px solid hsl(var(--border))',
      borderRadius: 10,
      background: 'hsl(var(--card))',
    }}
  >
    {children}
  </div>
);

// Eslatma: Reveal/StaggerGroup odatda `whileInView` orqali animatsiya qiladi.
// Statik preview kartasida hal qilingan (ko'rinadigan) holatni ko'rsatish uchun
// `initial="animate"` beriladi — komponent ishlovchi holatda namoyish etiladi.
export const ScrollReveal = () => (
  <Reveal initial="animate" style={{ maxWidth: 360 }}>
    <Box>
      <h3 style={{ margin: 0, fontWeight: 700 }}>Scroll-reveal blok</h3>
      <p style={{ margin: '6px 0 0', color: 'hsl(var(--muted-foreground))' }}>
        Ko'rinish maydoniga kirganda silliq paydo bo'ladi.
      </p>
    </Box>
  </Reveal>
);

export const Stagger = () => (
  <StaggerGroup initial="animate" style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
    {['Cisco tarmoqlar', 'Linux administratsiya', 'Aqlli uy & IoT'].map((t) => (
      <StaggerItem key={t}>
        <Box>{t}</Box>
      </StaggerItem>
    ))}
  </StaggerGroup>
);
