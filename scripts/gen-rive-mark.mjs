/**
 * NETLAB belgisi uchun Rive sahnasini (RML) yasaydi.
 *
 * Geometriya `src/components/brand/logo.tsx` dagi bilan bir xil manbadan:
 * 9 qator, 45 nuqta, pastga qarab torayuvchi voronka. Shu sababli logotip
 * o'zgarsa, bu yerdagi raqamlarni ham yangilash kerak — ikkala joyda bir xil
 * ROWS/SPACING/CENTER_X turadi.
 *
 * Qayta yurgizish:  node scripts/gen-rive-mark.mjs
 * So'ng:            rive rive/netlab-mark --once
 */
import { writeFileSync } from 'node:fs';

/* --- logo.tsx bilan bir xil --- */
const SPACING = 117.6;
const CENTER_X = 481.95;
const ROWS = [
  { r: 11.55, y: 11.55 },
  { r: 12.9, y: 39.25 },
  { r: 16.0, y: 72.55 },
  { r: 21.75, y: 116.65 },
  { r: 26.4, y: 170.75 },
  { r: 31.25, y: 234.85 },
  { r: 38.5, y: 313.65 },
  { r: 45.75, y: 413.45 },
  { r: 55.5, y: 529.55 },
];

/* --- animatsiya --- */
const FPS = 60;
const INTRO_LEN = 48; // 0,8 s
const ROW_DELAY = 3; // qatorlar orasidagi kechikish (kadr)
const ROW_RISE = 10; // bitta qator chiqish vaqti
const START_SCALE = 0.35;
const HOVER_LEN = 36;
const HOVER_DIM = 0.45; // to'lqin eng xira nuqtasi

/* propertyKey: transforms.md — x 13, y 14, rotation 15, scaleX 16, scaleY 17, opacity 18 */
const P_SCALE_X = 16;
const P_SCALE_Y = 17;
const P_OPACITY = 18;

const r1 = (n) => Math.round(n * 100) / 100;

/** Nuqtalar: markaz 0 bo'lgan qator koordinatalarida */
function rowDots(i) {
  const count = ROWS.length - i;
  const out = [];
  for (let k = 0; k < count; k++) {
    out.push(r1((k - (count - 1) / 2) * SPACING));
  }
  return out;
}

/* Artboard o'lchami: belgini o'rab turgan quti */
const minX = CENTER_X - ((ROWS.length - 1) / 2) * SPACING - ROWS[0].r;
const minY = ROWS[0].y - ROWS[0].r;
const WIDTH = r1(
  CENTER_X + ((ROWS.length - 1) / 2) * SPACING + ROWS[0].r - minX
);
const HEIGHT = r1(ROWS[ROWS.length - 1].y + ROWS[ROWS.length - 1].r - minY);

const ID = {
  artboard: '0:2',
  style: '0:5',
  machine: '0:7',
  layer: '0:8',
  introState: '0:12',
  hoverState: '0:13',
  intro: '0:20',
  hover: '0:21',
  ease: '0:30',
  row: (i) => `0:${40 + i}`,
};

/* --- shakllar --- */
const shapes = ROWS.map((row, i) => {
  const cy = r1(row.y - minY);
  const cx = r1(CENTER_X - minX);
  const d = r1(row.r * 2);
  const dots = rowDots(i)
    .map(
      (dx) =>
        `            <Shape x="${dx}" y="0" name="dot">
                <Ellipse width="${d}" height="${d}" name="Path"/>
                <Fill name="Fill"><SolidColor colorValue="FFFFFFFF" name="Color"/></Fill>
            </Shape>`
    )
    .join('\n');
  // Guruh qator markazida turadi — shuning uchun scale markazdan kengayadi
  return `        <Node x="${cx}" y="${cy}" name="row-${i + 1}" id="${ID.row(i)}">
${dots}
        </Node>`;
}).join('\n');

/* --- kalit kadrlar --- */
const key = (frame, value, interp = 'cubic') =>
  `                    <KeyFrameDouble frame="${frame}" value="${value}"` +
  (interp === 'cubic'
    ? ` interpolationType="cubic" interpolatorId="${ID.ease}"/>`
    : ` interpolationType="${interp}"/>`);

const keyed = (objectId, props) =>
  `            <KeyedObject objectId="${objectId}">
${props
  .map(
    ([propertyKey, frames]) =>
      `                <KeyedProperty propertyKey="${propertyKey}">
${frames.join('\n')}
                </KeyedProperty>`
  )
  .join('\n')}
            </KeyedObject>`;

/* intro: qatorlar yuqoridan pastga ketma-ket chiqadi */
const introKeys = ROWS.map((_, i) => {
  const start = i * ROW_DELAY;
  const end = start + ROW_RISE;
  const last = i === ROWS.length - 1;
  const opacity = [key(start, 0), key(end, 1)];
  // Pastdagi yagona nuqta "yetib keldi" zarbasini oladi
  const scale = last
    ? [key(start, START_SCALE), key(end, 1.12), key(end + 10, 1)]
    : [key(start, START_SCALE), key(end, 1)];
  return keyed(ID.row(i), [
    [P_OPACITY, opacity],
    [P_SCALE_X, scale],
    [P_SCALE_Y, scale],
  ]);
}).join('\n');

/* hover: yuqoridan pastga bitta yorug'lik to'lqini */
const hoverKeys = ROWS.map((_, i) => {
  const a = i * 2;
  return keyed(ID.row(i), [
    [P_OPACITY, [key(a, 1), key(a + 8, HOVER_DIM), key(a + 16, 1)]],
  ]);
}).join('\n');

const rml = `<Rive version="1" kind="fragment">
    <!-- AVTOMATIK YARATILGAN — qo'lda tahrirlamang.
         Manba: scripts/gen-rive-mark.mjs (geometriya logo.tsx bilan bir xil). -->
    <Artboard defaultStateMachineId="${ID.machine}" styleId="${ID.style}" width="${WIDTH}" height="${HEIGHT}" name="netlab-mark" id="${ID.artboard}">
        <LayoutComponentStyle name="Artboard Style" id="${ID.style}"/>
        <!-- Fon yo'q: belgi shaffof fonda turadi -->

${shapes}

        <CubicEaseInterpolator x1="0.16" y1="1" x2="0.3" y2="1" id="${ID.ease}"/>

        <StateMachine name="mark" id="${ID.machine}">
            <StateMachineLayer name="Layer 1" id="${ID.layer}">
                <AnyState x="520" y="-120"/>
                <ExitState x="720" y="-120"/>
                <EntryState>
                    <StateTransition stateToId="${ID.introState}"/>
                </EntryState>
                <AnimationState x="160" animationId="${ID.intro}" id="${ID.introState}">
                    <!-- enableExitTime: shartsiz o'tish darhol ishga tushadi,
                         shuning uchun intro tugashini kutish aniq aytiladi -->
                    <StateTransition stateToId="${ID.hoverState}" enableExitTime="true" exitTime="${Math.round((INTRO_LEN / FPS) * 1000)}" duration="240"/>
                </AnimationState>
                <AnimationState x="340" animationId="${ID.hover}" id="${ID.hoverState}"/>
            </StateMachineLayer>
        </StateMachine>

        <LinearAnimation fps="${FPS}" duration="${INTRO_LEN}" name="intro" id="${ID.intro}">
${introKeys}
        </LinearAnimation>

        <LinearAnimation fps="${FPS}" duration="${HOVER_LEN}" loopValue="loop" name="hover" id="${ID.hover}">
${hoverKeys}
        </LinearAnimation>
    </Artboard>
</Rive>
`;

writeFileSync('rive/netlab-mark/scene.rml', rml);
console.log(
  `scene.rml: ${WIDTH}×${HEIGHT}, ${ROWS.reduce((n, _, i) => n + ROWS.length - i, 0)} nuqta, ${rml.length} belgi`
);
