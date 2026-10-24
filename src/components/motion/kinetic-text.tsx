import * as React from 'react';

import { cn } from '@/lib/utils';

export interface KineticPart {
  text: string;
  /** Shu qismdagi har bir so'zga qo'shiladigan klass (masalan gradient) */
  className?: string;
}

/**
 * Kinetik sarlavha — matn so'zlarga bo'linadi va har bir so'z ketma-ket
 * ko'tarilib chiqadi hamda **qalinlashadi** (Inter variable font, `wght` 300→800).
 *
 * Oddiy fade'dan farqi: harakat matnning o'zida, shuning uchun sarlavha
 * "yoziladi" degan taassurot beradi. CSS animatsiyasi — JS yo'q.
 * `prefers-reduced-motion` da so'zlar darhol o'z joyida turadi (globals.css).
 *
 * Gradient qismda klass har bir so'zga alohida beriladi: `background-clip:text`
 * ota elementda bo'lsa, inline-block bola element ko'rinmay qoladi.
 */
export function KineticText({ parts }: { parts: KineticPart[] }) {
  let index = 0;

  return (
    <>
      {parts.map((part, pi) => {
        const words = part.text.split(/\s+/).filter(Boolean);
        return (
          <React.Fragment key={pi}>
            {words.map((word, wi) => {
              const i = index++;
              return (
                <React.Fragment key={`${pi}-${wi}`}>
                  <span
                    className={cn('kinetic-word', part.className)}
                    style={{ ['--i' as string]: i }}
                  >
                    {word}
                  </span>{' '}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}
