# Rive manbalari

Bu papkada NETLAB belgisi uchun Rive sahnasi turadi. **U saytda ishlatilmaydi** —
nega ishlatilmasligi quyida, o'lchangan raqamlar bilan.

## Nima bor

`netlab-mark/` — Rive CLI loyihasi. Sahna RML (XML matn) ko'rinishida, ya'ni
git'da ko'rinadi va diff qilinadi. `scene.rml` qo'lda yozilmaydi:
`scripts/gen-rive-mark.mjs` uni yasaydi va geometriyani
`src/components/brand/logo.tsx` dagi bilan bir xil manbadan oladi.

```bash
node scripts/gen-rive-mark.mjs        # scene.rml ni qayta yasash
rive rive/netlab-mark --verify        # kompilyatsiya tekshiruvi
rive rive/netlab-mark --once          # build/netlab-mark.riv (imzosiz)
rive rive/netlab-mark --screenshot=/tmp/a.png --advance=24
```

Rive CLI: `curl -fsSL https://releases.rive.app/cli/install.sh | sh`.
Linux x86_64 da ishlaydi, lokal ish uchun hisob kerak emas. Watch rejimi
uchun `libEGL`, `libGLESv2`, `libX11` kerak (`--once` va `--screenshot` uchun
ham, chunki binar ularni yuklanishda qidiradi).

## Nega saytda ishlatilmadi

Tayyor fayl ishlaydi: imzosiz `.riv` brauzerda `@rive-app/canvas` bilan
muammosiz ochilishi tekshirildi. Masala — runtime hajmida:

| | brotli |
|---|---|
| `@rive-app/canvas` (rive.js + rive.wasm) | **809 KB** |
| `@rive-app/canvas-lite` | **345 KB** |
| `netlab-mark.riv` o'zi | 0,9 KB |
| **Saytning hozirgi butun JS'i** | **87 KB** |

Ya'ni logotip animatsiyasi uchun saytning JS hajmi 4–10 barobar oshardi.
Harakatning o'zi esa qator bo'yicha `opacity` va `scale` dan iborat — buni
CSS hech qanday kutubxonasiz qiladi. Shuning uchun saytda CSS varianti
ishlatiladi: `globals.css` dagi `.logo-row` va `logo.tsx` dagi `animated`.

Ikkinchi sabab: Rive'da ranglar faylga qotib qoladi. Logotip esa
`currentColor` bilan ishlaydi va mavzu almashganda o'zi oq/qora bo'ladi.
Rive'da buni data binding orqali qaytadan qurish kerak bo'lardi.

Rive o'z og'irligini bitta yirik interaktiv element bo'lganda oqlaydi —
masalan qo'lda chizilgan sahna yoki kursorga javob beradigan personaj.
Shunday element paydo bo'lsa, bu yerdagi toolchain tayyor turibdi.
