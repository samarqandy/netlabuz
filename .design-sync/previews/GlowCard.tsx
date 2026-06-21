import { GlowCard } from 'netlabuz';

const Item = ({ title, sub }: { title: string; sub: string }) => (
  <>
    <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>{title}</h3>
    <p style={{ margin: '6px 0 0', fontSize: 14, color: 'hsl(var(--muted-foreground))' }}>{sub}</p>
  </>
);

export const Glows = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
    <GlowCard glow="blue" style={{ width: 200 }}>
      <Item title="Cisco" sub="Tarmoqlar" />
    </GlowCard>
    <GlowCard glow="green" style={{ width: 200 }}>
      <Item title="Linux" sub="Administratsiya" />
    </GlowCard>
    <GlowCard glow="cyan" style={{ width: 200 }}>
      <Item title="IoT" sub="Aqlli uy" />
    </GlowCard>
  </div>
);
