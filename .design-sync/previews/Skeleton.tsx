import { Skeleton } from 'netlabuz';

export const CardLoading = () => (
  <div
    style={{
      maxWidth: 320,
      display: 'grid',
      gap: 12,
      padding: 16,
      border: '1px solid hsl(var(--border))',
      borderRadius: 12,
    }}
  >
    <Skeleton style={{ height: 48, width: 48, borderRadius: 12 }} />
    <Skeleton style={{ height: 20, width: '80%' }} />
    <Skeleton style={{ height: 14, width: '100%' }} />
    <Skeleton style={{ height: 14, width: '60%' }} />
  </div>
);

export const Lines = () => (
  <div style={{ maxWidth: 320, display: 'grid', gap: 10 }}>
    <Skeleton style={{ height: 16, width: '100%' }} />
    <Skeleton style={{ height: 16, width: '90%' }} />
    <Skeleton style={{ height: 16, width: '75%' }} />
  </div>
);
