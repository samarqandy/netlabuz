import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from 'netlabuz';

export const CourseCard = () => (
  <Card style={{ maxWidth: 380 }}>
    <CardHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <CardTitle>Cisco / MikroTik tarmoqlar</CardTitle>
        <Badge variant="intermediate">O'rta</Badge>
      </div>
      <CardDescription>
        Routing, switching, VLAN, VPN va tarmoq xavfsizligi. CCNA darajasiga yo'naltirilgan amaliy kurs.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0, fontSize: 14, color: 'hsl(var(--muted-foreground))' }}>
        3 oy · haftada 3 dars · haqiqiy uskunalarda laboratoriya
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="accent">Ro'yxatdan o'tish</Button>
    </CardFooter>
  </Card>
);

export const Simple = () => (
  <Card style={{ maxWidth: 340 }}>
    <CardHeader>
      <CardTitle>Bepul konsultatsiya</CardTitle>
      <CardDescription>Mutaxassisimiz siz uchun mos yo'nalishni tanlashga yordam beradi.</CardDescription>
    </CardHeader>
  </Card>
);
