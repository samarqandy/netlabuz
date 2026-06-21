'use client';

import dynamic from 'next/dynamic';

/**
 * SceneBackground'ni dinamik (ssr:false) yuklaydi — og'ir GLSL shader kodi
 * alohida chunk'da, boshlang'ich bundle'ni shishirmaydi. Server'da render
 * qilinmaydi (WebGL faqat brauzerda).
 */
const SceneBackground = dynamic(
  () => import('./scene-background').then((m) => m.SceneBackground),
  { ssr: false }
);

export function Scene() {
  return <SceneBackground />;
}
