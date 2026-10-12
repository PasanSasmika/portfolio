import * as THREE from "three";

// every canvas is drawn at RES x its logical size so textures stay crisp when supersampled
const RES = 4;

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w * RES;
  c.height = h * RES;
  const ctx = c.getContext("2d")!;
  ctx.scale(RES, RES);
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  return t;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Grey dots on the white board */
export function dotGridTexture(repeat: number) {
  const { c, ctx } = canvas(64, 64);
  ctx.fillStyle = "#f6f7f9";
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "#bfc3cc";
  ctx.beginPath();
  ctx.arc(32, 32, 4, 0, Math.PI * 2);
  ctx.fill();
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

/** Light-blue floor grid that fades out at the edges */
export function floorGridTexture() {
  const size = 512;
  const { c, ctx } = canvas(size, size);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#c2d7f5";
  ctx.lineWidth = 1.5;
  const step = size / 24;
  for (let i = 0; i <= 24; i++) {
    ctx.beginPath();
    ctx.moveTo(i * step, 0);
    ctx.lineTo(i * step, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * step);
    ctx.lineTo(size, i * step);
    ctx.stroke();
  }
  // fade edges to transparent
  ctx.globalCompositeOperation = "destination-in";
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.15, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return toTexture(c);
}

export type IconKind =
  | "calendar" | "nodes" | "cloud" | "asterisk" | "bolt"
  | "video" | "chat" | "sync" | "wave" | "grid" | "stack" | "pin";

/** Original placeholder app icons (white glyph on a coloured tile, transparent outside the tile) */
export function iconTexture(kind: IconKind, bg: string) {
  const S = 256;
  const { c, ctx } = canvas(S, S);
  // subtle top-to-bottom sheen so the tile doesn't read as a flat sticker
  const sheen = ctx.createLinearGradient(0, 8, 0, S - 8);
  sheen.addColorStop(0, "rgba(255,255,255,0.16)");
  sheen.addColorStop(0.55, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(0,0,0,0.12)");
  roundRect(ctx, 8, 8, S - 16, S - 16, 50);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.fillStyle = sheen;
  ctx.fill();

  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const cx = S / 2, cy = S / 2;

  switch (kind) {
    case "calendar":
      roundRect(ctx, 70, 78, 116, 104, 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(70, 112); ctx.lineTo(186, 112); ctx.stroke();
      ctx.fillRect(98, 132, 20, 20); ctx.fillRect(138, 132, 20, 20);
      break;
    case "nodes":
      ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.stroke();
      [[-60, -50], [60, -40], [0, 66]].forEach(([dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * 0.7, cy + dy * 0.7); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 14, 0, Math.PI * 2); ctx.fill();
      });
      break;
    case "cloud":
      ctx.beginPath();
      ctx.arc(100, 140, 32, Math.PI * 0.5, Math.PI * 1.5);
      ctx.arc(135, 108, 40, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(165, 140, 30, Math.PI * 1.5, Math.PI * 0.5);
      ctx.closePath(); ctx.fill();
      break;
    case "asterisk":
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(a) * 62, cy - Math.sin(a) * 62);
        ctx.lineTo(cx + Math.cos(a) * 62, cy + Math.sin(a) * 62);
        ctx.lineWidth = 26; ctx.stroke();
      }
      break;
    case "bolt":
      ctx.beginPath();
      ctx.moveTo(145, 58); ctx.lineTo(88, 138); ctx.lineTo(126, 138);
      ctx.lineTo(110, 198); ctx.lineTo(170, 112); ctx.lineTo(132, 112);
      ctx.closePath(); ctx.fill();
      break;
    case "video":
      roundRect(ctx, 62, 92, 96, 72, 14); ctx.fill();
      ctx.beginPath(); ctx.moveTo(166, 128); ctx.lineTo(198, 102); ctx.lineTo(198, 154); ctx.closePath(); ctx.fill();
      break;
    case "chat":
      roundRect(ctx, 64, 70, 128, 92, 26); ctx.fill();
      ctx.beginPath(); ctx.moveTo(96, 156); ctx.lineTo(86, 192); ctx.lineTo(126, 160); ctx.fill();
      break;
    case "sync":
      ctx.beginPath(); ctx.arc(cx, cy, 52, Math.PI * 0.15, Math.PI * 0.95); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 52, Math.PI * 1.15, Math.PI * 1.95); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(170, 82); ctx.lineTo(180, 118); ctx.lineTo(146, 112); ctx.fill();
      ctx.beginPath(); ctx.moveTo(86, 174); ctx.lineTo(76, 138); ctx.lineTo(110, 144); ctx.fill();
      break;
    case "wave":
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.moveTo(158, 82);
      ctx.bezierCurveTo(70, 70, 70, 130, 128, 128);
      ctx.bezierCurveTo(186, 126, 186, 190, 98, 176);
      ctx.stroke();
      break;
    case "grid":
      [[74, 74], [134, 74], [74, 134], [134, 134]].forEach(([x, y], i) => {
        ctx.globalAlpha = i === 3 ? 0.55 : 1;
        roundRect(ctx, x, y, 48, 48, 10); ctx.fill();
      });
      ctx.globalAlpha = 1;
      break;
    case "stack":
      [80, 118, 156].forEach((y) => { roundRect(ctx, 72, y - 12, 112, 24, 12); ctx.fill(); });
      break;
    case "pin":
      ctx.beginPath(); ctx.arc(cx, 112, 44, Math.PI * 0.85, Math.PI * 2.15);
      ctx.lineTo(cx, 196); ctx.closePath(); ctx.fill();
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, 112, 16, 0, Math.PI * 2); ctx.fill();
      break;
  }
  return toTexture(c);
}

/** Top of the rising cube: an abstract logo mark */
export function logoTexture() {
  const S = 512;
  const { c, ctx } = canvas(S, S);
  ctx.fillStyle = "#1c1d21";
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(200, 290, 90, Math.PI, 0);
  ctx.lineTo(290, 330);
  ctx.lineTo(110, 330);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(330, 150); ctx.lineTo(410, 150); ctx.lineTo(340, 350); ctx.lineTo(300, 350);
  ctx.closePath(); ctx.fill();
  return toTexture(c);
}

/** Side of the rising cube: "Workflows" label */
export function labelTexture(text: string) {
  const W = 512, H = 440;
  const { c, ctx } = canvas(W, H);
  ctx.fillStyle = "#1c1d21";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 78px system-ui, -apple-system, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, H * 0.42);
  return toTexture(c);
}

/** Small dark plate icon on the hub / output card */
export function plateTexture() {
  const S = 256;
  const { c, ctx } = canvas(S, S);
  ctx.fillStyle = "#1c1d21";
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 12;
  const pts = [[88, 150], [168, 150], [128, 90]];
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.lineTo(pts[1][0], pts[1][1]);
  ctx.stroke();
  pts.forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#1c1d21"; ctx.fill(); ctx.stroke();
  });
  return toTexture(c);
}