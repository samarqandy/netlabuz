'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, MapPin, Send, Loader2, CheckCircle2, MessageCircle } from 'lucide-react';

import { COURSES } from '@/lib/courses';
import { cn } from '@/lib/utils';
import { track } from '@/lib/track';
import { ORG } from '@/lib/org';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/section-heading';

const PHONE = ORG.phone;
const TELEGRAM = ORG.telegram;
const MAP_URL = ORG.mapUrl;
const PHONE_RE = /^\+?998[0-9]{9}$/;

type Status = 'idle' | 'sending' | 'success' | 'error';
type Errors = Partial<Record<'name' | 'phone' | 'course', boolean>>;

export function Contact() {
  const t = useTranslations('Contact');
  const tc = useTranslations('Courses');

  const [status, setStatus] = React.useState<Status>('idle');
  const [errors, setErrors] = React.useState<Errors>({});
  const [selectedCourse, setSelectedCourse] = React.useState('');

  // Kurs kartasidagi "Yozilish" tugmasi formada kursni oldindan tanlaydi
  React.useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (COURSES.some((c) => c.id === id)) {
        setSelectedCourse(id);
        setErrors((prev) => ({ ...prev, course: false }));
      }
    };
    window.addEventListener('netlab:select-course', onSelect);
    return () => window.removeEventListener('netlab:select-course', onSelect);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').replace(/\s/g, '');
    const email = String(data.get('email') || '').trim();
    const course = String(data.get('course') || '');
    const note = String(data.get('message') || '').trim();

    const nextErrors: Errors = {};
    if (name.length < 2) nextErrors.name = true;
    if (!PHONE_RE.test(phone)) nextErrors.phone = true;
    if (!course) nextErrors.course = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Email forma maydoni api/send shartnomasini buzmaslik uchun izohga qo'shiladi.
    const message = email ? `Email: ${email}\n${note}` : note;

    setStatus('sending');
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, course, message }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      form.reset();
      setSelectedCourse('');
      track('lead_submitted', { course });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      // overflow-hidden: slideIn reveal'larning boshlang'ich translateX(±32px)
      // holati mobilda gorizontal scroll ochmasligi uchun
      className="scroll-mt-20 overflow-hidden border-t border-border/60 bg-secondary/20 py-20 sm:py-28"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-5">
          {/* Aloqa ma'lumotlari */}
          {/* min-w-0: grid item ichidagi select min-content kengligi
              kartani viewport'dan chiqarib yubormasligi uchun */}
          <Reveal variant="slideInLeft" className="min-w-0 lg:col-span-2">
            <div className="flex h-full flex-col gap-4">
              <ContactRow
                href={`tel:${PHONE}`}
                Icon={Phone}
                label={t('infoPhone')}
                value={PHONE}
              />
              <ContactRow
                href={TELEGRAM}
                Icon={MessageCircle}
                label="Telegram"
                value={ORG.telegramHandle}
                external
                onClick={() => track('telegram_click', { location: 'contact' })}
              />
              <ContactRow
                href={MAP_URL}
                Icon={MapPin}
                label={t('infoAddress')}
                value={t('address')}
                external
              />
            </div>
          </Reveal>

          {/* Forma */}
          <Reveal variant="slideInRight" className="min-w-0 lg:col-span-3">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-3 py-12 text-center"
                  >
                    <CheckCircle2 className="size-14 text-accent" />
                    <h3 className="text-xl font-bold">{t('successTitle')}</h3>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {t('successText')}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setStatus('idle')}
                    >
                      {t('again')}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={onSubmit}
                    noValidate
                    className="grid gap-4"
                  >
                    <Field label={t('name')} htmlFor="name" error={errors.name && t('nameError')}>
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder={t('namePlaceholder')}
                        aria-invalid={errors.name}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t('phone')} htmlFor="phone" error={errors.phone && t('phoneError')}>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+998 90 123 45 67"
                          aria-invalid={errors.phone}
                        />
                      </Field>
                      <Field label={t('email')} htmlFor="email" optional={t('optional')}>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="email@example.com"
                        />
                      </Field>
                    </div>

                    <Field label={t('course')} htmlFor="course" error={errors.course && t('courseError')}>
                      <Select
                        id="course"
                        name="course"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        aria-invalid={errors.course}
                        required
                      >
                        <option value="" disabled>
                          {t('coursePlaceholder')}
                        </option>
                        {COURSES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {tc(`items.${c.id}.name`)}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field label={t('message')} htmlFor="message" optional={t('optional')}>
                      <Textarea
                        id="message"
                        name="message"
                        rows={3}
                        placeholder={t('messagePlaceholder')}
                      />
                    </Field>

                    {status === 'error' && (
                      <p role="alert" className="text-sm text-destructive">
                        {t('errorText')}
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      disabled={status === 'sending'}
                      className="mt-1"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> {t('sending')}
                        </>
                      ) : (
                        <>
                          {t('submit')} <Send className="size-4" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  href,
  Icon,
  label,
  value,
  external,
  onClick,
}: {
  href?: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-secondary/40 text-accent">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="block truncate font-medium">{value}</span>
      </span>
    </>
  );

  const base =
    'flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors';

  if (!href) return <div className={base}>{inner}</div>;
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={onClick}
      className={cn(base, 'hover:border-primary/50 hover:bg-card/80')}
    >
      {inner}
    </a>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string | false;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">({optional})</span>
        )}
      </Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
