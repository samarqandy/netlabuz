'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

/* =========================================================================
 * NETLAB — "Tirik" WebGL fon (raw WebGL + GLSL, Three.js YO'Q)
 *
 * Butun sayt orqasida bitta to'liq ekran sahna. Scroll qaysi seksiyada
 * ekanini IntersectionObserver kuzatadi va shader "mode"ini silliq morf qiladi.
 * Har seksiyaga alohida vizual:
 *   0 Hero    — tarmoq grafi + oqayotgan data paketlari
 *   1 Kurslar — tugun-bog' (node-link) tarmoq
 *   2 Stats   — zarra konstellatsiyasi + GIRIH (Oltin Islom asri, oltin accent)
 *   3 Jarayon — flow-field (oqim maydoni) simulyatsiyasi
 *   4 Aloqa   — signal to'lqin animatsiyasi
 *
 * Perf: dynamic import (scene.tsx), prefers-reduced-motion -> statik kadr,
 *       WebGL yo'q/yorug' mavzu -> CSS gradient fallback, tab yashiringanda
 *       pauza, 30 FPS cheklovi, ekran o'lchamidan past render (CSS cho'zadi)
 *       va adaptiv sifat: sekin qurilmada o'lcham pasayadi, oxirida o'chadi.
 * Estetika: Vercel + Linear + Stripe darajasi; korporativ/ta'limiy tech.
 * ========================================================================= */

const SECTION_MODE: Record<string, number> = {
  home: 0,
  courses: 1,
  quiz: 1,
  why: 2,
  stats: 2,
  how: 3,
  mentors: 3,
  reviews: 3,
  faq: 4,
  contact: 4,
};

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform float uMode;   // 0..4 (lerp)
uniform float uScroll; // 0..1

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<3;i++){ v+=a*noise(p); p=m*p; a*=0.5; }  // 3 oktava yetarli (fon xira)
  return v;
}
float segDist(vec2 p, vec2 a, vec2 b){
  vec2 pa=p-a, ba=b-a;
  float h=clamp(dot(pa,ba)/dot(ba,ba), 0.0, 1.0);
  return length(pa-ba*h);
}

// Hujayra ichidagi (animatsiyali dreyf) tugun pozitsiyasi
vec2 nodePos(vec2 id){
  float h1 = hash(id), h2 = hash(id+3.3);
  return 0.5 + 0.34*vec2(sin(h1*6.2831 + uTime*0.25), cos(h2*6.2831 + uTime*0.20));
}

// Tarmoq: tugunlar + bog'lanishlar + oqayotgan paketlar
// return: x = tugun yorqinligi, y = bog'/paket yorqinligi
vec2 network(vec2 uv, float pktSpeed){
  vec2 id=floor(uv), f=fract(uv);
  vec2 c=nodePos(id);
  float node=0.0, link=0.0;
  for(int j=-1;j<=1;j++){
    for(int i=-1;i<=1;i++){
      vec2 o=vec2(float(i),float(j));
      vec2 nid=id+o;
      vec2 np=o+nodePos(nid);
      node += smoothstep(0.10, 0.0, length(f-np));
      float dl=segDist(f, c, np);
      link += smoothstep(0.030, 0.0, dl)*0.7;
      // oqayotgan data paketi (bog' bo'ylab harakatlanuvchi nuqta)
      float tt=fract(uTime*pktSpeed + hash(nid*1.7+id));
      vec2 pk=mix(c, np, tt);
      link += smoothstep(0.045, 0.0, length(f-pk))*1.7;
    }
  }
  return vec2(node, link);
}

// 8-burchakli yulduz ramkasi (girih elementi) — ikki kvadrat 45° aylantirilgan
float boxFrame(vec2 p, float s){
  vec2 d=abs(p)-s;
  float sd=length(max(d,0.0))+min(max(d.x,d.y),0.0);
  return smoothstep(0.022, 0.0, abs(sd));
}
// GIRIH tessellatsiyasi — Samarqand koshinlari (Oltin Islom asri geometriyasi)
float girih(vec2 uv, float scale){
  vec2 p=fract(uv*scale)-0.5;
  float a=boxFrame(p, 0.30);
  vec2 pr=vec2(p.x+p.y, p.x-p.y)*0.70710678;
  float b=boxFrame(pr, 0.30);
  return max(a, b);
}

// Flow-field — fbm yo'naltirilgan oqim chiziqlari
float flowField(vec2 uv){
  float a=fbm(uv*1.1 + uTime*0.04)*6.2831;
  vec2 d=vec2(cos(a), sin(a));
  float s=sin((uv.x*d.y - uv.y*d.x)*26.0 - uTime*2.2);
  return smoothstep(0.55, 1.0, s);
}

// Signal to'lqinlari — gorizontal signal + konsentrik to'lqin
float signalWave(vec2 uv){
  float w1=sin(uv.x*4.0 - uTime*2.0)*0.16;
  float w2=sin(uv.x*9.0 + uTime*1.3)*0.07;
  float line=smoothstep(0.05, 0.0, abs(uv.y - (w1+w2)));
  float dd=length(uv - vec2(0.0,-0.25));
  float rip=sin(dd*15.0 - uTime*3.0);
  float ripple=smoothstep(0.65,1.0,rip)*smoothstep(1.7,0.2,dd);
  return line + ripple*0.5;
}

float stars(vec2 uv, float density){
  vec2 g=uv*density; vec2 cell=floor(g); float h=hash(cell);
  float on=step(0.986, h);
  float d=length(fract(g)-0.5);
  float fl=0.6+0.4*sin(uTime*2.0 + h*60.0);
  return on*smoothstep(0.45,0.0,d)*fl;
}

void main(){
  vec2 uv=(gl_FragCoord.xy*2.0 - uRes)/uRes.y;
  float m=uMode;

  // Mode og'irliklari (qo'shni ikki sahna o'rtasida silliq blend)
  float w0=clamp(1.0-abs(m-0.0),0.0,1.0);
  float w1=clamp(1.0-abs(m-1.0),0.0,1.0);
  float w2=clamp(1.0-abs(m-2.0),0.0,1.0);
  float w3=clamp(1.0-abs(m-3.0),0.0,1.0);
  float w4=clamp(1.0-abs(m-4.0),0.0,1.0);

  // Vazmin premium palitra — to'yinganlik pasaytirilgan, chuqur tonlar.
  // Fon kontent bilan raqobatlashmasligi kerak: his qilinadi, ko'zga tashlanmaydi.
  vec3 cBlue=vec3(0.10,0.32,0.72);
  vec3 cCyan=vec3(0.15,0.55,0.75);
  vec3 cGold=vec3(0.85,0.66,0.30); // Oltin Islom asri (yumshatilgan)
  vec3 cInd =vec3(0.32,0.38,0.78);
  vec3 cGreen=vec3(0.05,0.62,0.40);

  vec3 base=vec3(0.010,0.014,0.028);
  vec3 color=base;

  // scroll parallaks (cheksiz chuqurlik hissi)
  vec2 puv=uv + vec2(0.0, uScroll*0.6);

  // --- 0/1: Tarmoq (Hero: paketlar; Kurslar: tinchroq node-link) ---
  // Kam zichlik + past yorqinlik: nozik tekstura, dominant emas
  float wnet=clamp(w0+w1, 0.0, 1.0);
  if(wnet>0.001){
    float pkt=mix(0.30, 0.10, w1/(wnet+1e-4)); // sekin paketlar
    vec2 net=network(puv*2.4, pkt);
    vec3 ncol=mix(cBlue, cCyan, w1/(wnet+1e-4));
    color += ncol*net.x*0.55*wnet;       // tugunlar
    color += ncol*net.y*0.38*wnet;       // bog'lar + paketlar
  }

  // --- 2: Konstellatsiya + GIRIH (oltin) ---
  if(w2>0.001){
    vec2 con=network(puv*1.9, 0.07);
    color += cInd*con.x*0.50*w2;
    color += mix(cInd,cGold,0.5)*con.y*0.24*w2;
    float g=girih(uv, 1.6);
    color += cGold*g*0.07*w2;            // juda nozik oltin girih
    color += cGold*0.008*w2;             // iliq ambient
  }

  // --- 3: Flow-field ---
  if(w3>0.001){
    float fl=flowField(puv);
    color += cGreen*fl*0.20*w3;
    color += mix(cGreen,cCyan,0.5)*fbm(puv*1.5+uTime*0.05)*0.05*w3;
  }

  // --- 4: Signal to'lqinlari ---
  if(w4>0.001){
    float sw=signalWave(uv);
    color += cBlue*sw*0.30*w4;
    color += cCyan*sw*0.12*w4;
  }

  // Yulduzlar — juda nozik chaqnash
  float starAmt=clamp(w0+w1*0.6+w4*0.8, 0.0, 1.0);
  float s=stars(uv+vec2(uTime*0.01,0.0),16.0);
  color += vec3(0.85,0.92,1.0)*s*starAmt*0.30;

  // Vinetka — kontent kontrasti uchun
  float vig=smoothstep(1.5,0.25,length(uv));
  color *= mix(0.45,1.0,vig);
  // Umumiy xiralashtirish — fon "his qilinadi, ko'rinmaydi" darajasida
  color *= 0.60;

  gl_FragColor=vec4(color,1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function SceneBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';

  React.useEffect(() => {
    if (!dark) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return; // CSS fallback ko'rinadi

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    // Fon — xira tekstura, shuning uchun ekran o'lchamidan past render qilinadi
    // va CSS uni cho'zadi. Bu piksel sonini ~10 barobar kamaytiradi.
    // Sifat pog'onalari: sekin qurilmada pastga tushamiz, oxirida o'chiramiz.
    const SCALES = coarse ? [0.45, 0.3, 0.2] : [0.48, 0.34, 0.22];
    // Fon uchun 30 FPS yetarli — barcha qurilmalarda cheklaymiz
    const minFrame = 1000 / 30;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMode = gl.getUniformLocation(prog, 'uMode');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');

    let quality = 0;
    let scale = SCALES[0];
    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth * scale));
      const h = Math.max(1, Math.floor(window.innerHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    let scroll = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();

    let targetMode = 0;
    let curMode = 0;
    const ratios = new Map<string, number>();
    const sections = Object.keys(SECTION_MODE)
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target.id, e.intersectionRatio);
        let best = 'home';
        let bestR = -1;
        ratios.forEach((r, id) => {
          if (r > bestR) {
            bestR = r;
            best = id;
          }
        });
        targetMode = SECTION_MODE[best] ?? 0;
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((sec) => io.observe(sec));

    let raf = 0;
    let running = true;
    let last = 0;
    const t0 = performance.now();

    const renderFrame = (now: number) => {
      // 0.55 — sekin, bosiqroq harakat (premium his)
      const time = reduce ? 0 : ((now - t0) / 1000) * 0.55;
      curMode += (targetMode - curMode) * 0.06;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uMode, reduce ? 0 : curMode);
      gl.uniform1f(uScroll, reduce ? 0 : scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* ----------------------------- Adaptiv sifat -----------------------------
     * Qurilma sekin bo'lsa fon uni sudrab yurmasligi kerak. Render qilingan
     * kadrlar oralig'ini kuzatamiz: barqaror sekin bo'lsa avval o'lchamni
     * pasaytiramiz, pog'onalar tugagach sahnani butunlay o'chiramiz —
     * ortida CSS gradient qoladi, sayt hech narsa yo'qotmaydi.
     * -------------------------------------------------------------------- */
    const SAMPLE = 30;          // nechta kadrdan keyin baho beriladi
    const SLOW_MS = 45;         // median kadr oralig'i shundan yomon bo'lsa — sekin
    let samples: number[] = [];
    let warmup = 15;            // shader/JIT qizishi uchun birinchi kadrlar
    let prev = 0;

    const degrade = () => {
      quality += 1;
      if (quality < SCALES.length) {
        scale = SCALES[quality];
        resize();
      } else {
        // Oxirgi chora: sahnani to'xtatamiz va canvasni yashiramiz
        running = false;
        cancelAnimationFrame(raf);
        canvas.style.display = 'none';
      }
      samples = [];
      warmup = 15;
    };

    const sample = (now: number) => {
      if (prev) {
        if (warmup > 0) warmup -= 1;
        else samples.push(now - prev);
      }
      prev = now;
      if (samples.length >= SAMPLE) {
        const sorted = [...samples].sort((a, b) => a - b);
        const median = sorted[sorted.length >> 1];
        samples = [];
        if (median > SLOW_MS) degrade();
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < minFrame) return; // 30 FPS cheklovi
      last = now;
      renderFrame(now);
      sample(now);
    };

    if (reduce) {
      renderFrame(t0);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      onScroll();
      if (reduce) renderFrame(performance.now());
    };
    window.addEventListener('resize', onResize);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce && quality < SCALES.length) {
        running = true;
        last = 0;
        prev = 0;          // tanaffusdan keyingi uzun oraliq sekinlik hisoblanmasin
        samples = [];
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
    };
    canvas.addEventListener('webglcontextlost', onLost);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [dark]);

  if (!dark) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#081022_0%,#04060d_55%,#000_100%)]"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}

export default SceneBackground;
