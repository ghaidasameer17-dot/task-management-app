import { useRef, useEffect, useCallback } from 'react';

const SIZE = 180;
const RADIUS = SIZE / 2;

function hsvToRgb(h, s, v) {
  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r, g, b;
  if (hh >= 0 && hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = v - c;
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return null;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

const ColorWheel = ({ value, onChange }) => {
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);

  const drawWheel = useCallback((ctx) => {
    const img = ctx.createImageData(SIZE, SIZE);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - RADIUS;
        const dy = y - RADIUS;
        const r = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * SIZE + x) * 4;
        if (r <= RADIUS) {
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const hue = (angle + 360) % 360;
          const sat = Math.min(r / RADIUS, 1);
          const [rr, gg, bb] = hsvToRgb(hue, sat, 1);
          img.data[idx] = rr;
          img.data[idx + 1] = gg;
          img.data[idx + 2] = bb;
          img.data[idx + 3] = 255;
        } else {
          img.data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawWheel(ctx);
  }, [drawWheel]);

  const pickAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let dx = clientX - rect.left - RADIUS;
    let dy = clientY - rect.top - RADIUS;
    let r = Math.sqrt(dx * dx + dy * dy);
    if (r > RADIUS) {
      dx = (dx / r) * RADIUS;
      dy = (dy / r) * RADIUS;
      r = RADIUS;
    }
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const hue = (angle + 360) % 360;
    const sat = r / RADIUS;
    const [rr, gg, bb] = hsvToRgb(hue, sat, 1);
    onChange(rgbToHex(rr, gg, bb));
  };

  const handleDown = (e) => {
    draggingRef.current = true;
    pickAt(e.clientX, e.clientY);
  };
  const handleMove = (e) => {
    if (!draggingRef.current) return;
    pickAt(e.clientX, e.clientY);
  };
  const stopDrag = () => { draggingRef.current = false; };

  const rgb = hexToRgb(value) || [47, 111, 237];
  const [h, s] = rgbToHsv(...rgb);
  const angleRad = (h * Math.PI) / 180;
  const dotR = s * RADIUS;
  const dotX = RADIUS + dotR * Math.cos(angleRad);
  const dotY = RADIUS + dotR * Math.sin(angleRad);

  return (
    <div className="color-wheel-wrap" style={{ width: SIZE, height: SIZE }}>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="color-wheel-canvas"
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      />
      <div
        className="color-wheel-dot"
        style={{ left: dotX, top: dotY, background: value }}
      />
    </div>
  );
};

export default ColorWheel;
