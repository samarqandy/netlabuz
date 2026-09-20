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
 *       pauza, DPR <= 2 (mobil <= 1.5), past quvvatli mobil ~30 FPS throttle.
 * Estetika: Vercel + Linear + Stripe darajasi; korporativ/ta'limiy tech.
 * ========================================================================= */

const SECTION_MODE: Record<string, number> = {
  home: 0,
  courses: 1,
  why: 2,
  stats: 2,
  how: 3,
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
  for(int i=0;i<4;i++){ v+=a*noise(p); p=m*p; a*=0.5; }
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

  // Brend palitra + Oltin asr accenti
  vec3 cBlue=vec3(0.00,0.42,0.95);
  vec3 cCyan=vec3(0.00,0.85,1.00);
  vec3 cGold=vec3(1.00,0.78,0.32); // Oltin Islom asri
  vec3 cInd =vec3(0.40,0.48,1.00);
  vec3 cGreen=vec3(0.00,1.00,0.55);

  vec3 base=vec3(0.012,0.018,0.035);
  vec3 color=base;

  // scroll parallaks (cheksiz chuqurlik hissi)
  vec2 puv=uv + vec2(0.0, uScroll*0.6);

  // --- 0/1: Tarmoq (Hero: paketlar; Kurslar: tinchroq node-link) ---
  float wnet=clamp(w0+w1, 0.0, 1.0);
  if(wnet>0.001){
    float pkt=mix(0.45, 0.16, w1/(wnet+1e-4)); // Hero tezroq paket
    vec2 net=network(puv*3.0, pkt);
    vec3 ncol=mix(cBlue, cCyan, w1/(wnet+1e-4));
    color += ncol*net.x*1.10*wnet;       // tugunlar
    color += ncol*net.y*0.85*wnet;       // bog'lar + paketlar
  }

  // --- 2: Konstellatsiya + GIRIH (oltin) ---
  if(w2>0.001){
    vec2 con=network(puv*2.2, 0.10);
    color += cInd*con.x*1.0*w2;
    color += mix(cInd,cGold,0.5)*con.y*0.5*w2;
    float g=girih(uv, 1.6);
    color += cGold*g*0.16*w2;            // nozik oltin girih
    color += cGold*0.015*w2;             // iliq ambient
  }

  // --- 3: Flow-field ---
  if(w3>0.001){
    float fl=flowField(puv);
    color += cGreen*fl*0.5*w3;
    color += mix(cGreen,cCyan,0.5)*fbm(puv*1.5+uTime*0.05)*0.12*w3;
  }

  // --- 4: Signal to'lqinlari ---
  if(w4>0.001){
    float sw=signalWave(uv);
    color += cBlue*sw*0.8*w4;
    color += cCyan*sw*0.3*w4;
  }

  // Yulduzlar — kosmik sahnalarda (Hero/Kurslar/Aloqa) kuchliroq
  float starAmt=clamp(w0+w1*0.6+w4*0.8, 0.0, 1.0);
  float s=stars(uv+vec2(uTime*0.01,0.0),14.0)+stars(uv*1.8,22.0)*0.5;
  color += vec3(0.85,0.92,1.0)*s*starAmt*0.6;

  // Vinetka — kontent kontrasti uchun
  float vig=smoothstep(1.5,0.25,length(uv));
  color *= mix(0.5,1.0,vig);
  // Umumiy xiralashtirish — fon kontent bilan raqobatlashmasligi uchun
  color *= 0.68;

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
    const minFrame = coarse ? 1000 / 30 : 0; // past quvvatli mobil ~30 FPS

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

    let dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
    const resize = () => {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
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
      const time = reduce ? 0 : (now - t0) / 1000;
      curMode += (targetMode - curMode) * 0.06;
      gl.uniform1f(uTime, time);
      gl.uniform1f(uMode, reduce ? 0 : curMode);
      gl.uniform1f(uScroll, reduce ? 0 : scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < minFrame) return; // FPS throttle (mobil)
      last = now;
      renderFrame(now);
    };

    if (reduce) {
      renderFrame(t0);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      resize();
      onScroll();
      if (reduce) renderFrame(performance.now());
    };
    window.addEventListener('resize', onResize);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        last = 0;
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
      className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#0a1430_0%,#05070f_55%,#000_100%)]"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}

export default SceneBackground;
