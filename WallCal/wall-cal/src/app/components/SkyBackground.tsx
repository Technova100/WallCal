"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeContext";

// --- Time helpers ---
function getTimePhase(hour: number): "night" | "dawn" | "morning" | "day" | "evening" | "dusk" {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 10) return "morning";
  if (hour >= 10 && hour < 16) return "day";
  if (hour >= 16 && hour < 19) return "evening";
  if (hour >= 19 && hour < 21) return "dusk";
  return "night";
}

const SKY_GRADIENTS: Record<string, string[]> = {
  night:   ["#0a0e27", "#0d1333", "#111a3a"],
  dawn:    ["#1a1040", "#5c3d6e", "#e8956a"],
  morning: ["#4a98d4", "#87ceeb", "#c8e6f5"],
  day:     ["#2e8bc0", "#5fb3e0", "#a8daee"],
  evening: ["#1a1040", "#c0504d", "#eb8c50", "#f5c76b"],
  dusk:    ["#141030", "#3d2560", "#8a4570"],
};

interface Star {
  x: number;
  y: number;
  r: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  brightness: number;
}

// Sky gradients for explicit theme overrides
const OVERRIDE_DAY: string[]   = ["#2e8bc0", "#5fb3e0", "#a8daee"];
const OVERRIDE_NIGHT: string[] = ["#0a0e27", "#0d1333", "#111a3a"];

export default function SkyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const { theme } = useTheme();
  // Keep a ref so the draw loop can read the latest theme without re-mounting
  const themeRef = useRef(theme);
  useEffect(() => { themeRef.current = theme; }, [theme]);

  // Generate stars once
  const generateStars = useCallback((w: number, h: number): Star[] => {
    const stars: Star[] = [];
    const count = Math.floor((w * h) / 2500); // density based on screen size
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }
    return stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      starsRef.current = generateStars(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const now = new Date();
      const hour = now.getHours();
      const naturalPhase = getTimePhase(hour);

      // If user has explicitly chosen a theme, override the sky
      const overrideTheme = themeRef.current;
      const currentPhase = overrideTheme === "dark" ? "night"
                         : overrideTheme === "light" ? "day"
                         : naturalPhase;

      const colors =
        overrideTheme === "dark"  ? OVERRIDE_NIGHT :
        overrideTheme === "light" ? OVERRIDE_DAY   :
        SKY_GRADIENTS[currentPhase];
      
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      colors.forEach((c, i) => skyGrad.addColorStop(i / (colors.length - 1), c));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      const t = performance.now() / 1000;

      // Stars (visible at night, dawn, dusk)
      const starPhases = ["night", "dawn", "dusk"];
      const starOpacity =
        currentPhase === "night" ? 1 :
        currentPhase === "dawn" ? 0.4 :
        currentPhase === "dusk" ? 0.6 :
        currentPhase === "evening" ? 0.3 : 0;

      if (starOpacity > 0) {
        starsRef.current.forEach((star) => {
          const twinkle = Math.sin(t * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.5 + 0.5;
          const alpha = star.brightness * twinkle * starOpacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          // Glow for bigger stars
          if (star.r > 1.2) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
            const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
            glow.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.3})`);
            glow.addColorStop(1, "transparent");
            ctx.fillStyle = glow;
            ctx.fill();
          }
        });
      }

      // Moon (night / dusk / dawn)
      if (currentPhase === "night" || currentPhase === "dusk" || currentPhase === "dawn") {
        const moonOpacity = currentPhase === "night" ? 1 : 0.5;
        const mx = w * 0.12;
        const my = h * 0.15;
        const mr = Math.min(w, h) * 0.04;

        // Moon glow
        const moonGlow = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4);
        moonGlow.addColorStop(0, `rgba(200, 210, 255, ${0.15 * moonOpacity})`);
        moonGlow.addColorStop(0.5, `rgba(180, 200, 255, ${0.05 * moonOpacity})`);
        moonGlow.addColorStop(1, "transparent");
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(mx, my, mr * 4, 0, Math.PI * 2);
        ctx.fill();

        // Moon body
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        const moonGrad = ctx.createRadialGradient(mx - mr * 0.2, my - mr * 0.2, 0, mx, my, mr);
        moonGrad.addColorStop(0, `rgba(255, 255, 245, ${moonOpacity})`);
        moonGrad.addColorStop(0.7, `rgba(230, 230, 220, ${moonOpacity})`);
        moonGrad.addColorStop(1, `rgba(200, 200, 195, ${moonOpacity * 0.8})`);
        ctx.fillStyle = moonGrad;
        ctx.fill();

        // Craters
        const craters = [
          { cx: mx - mr * 0.25, cy: my - mr * 0.1, cr: mr * 0.15 },
          { cx: mx + mr * 0.2, cy: my + mr * 0.25, cr: mr * 0.1 },
          { cx: mx + mr * 0.05, cy: my - mr * 0.35, cr: mr * 0.08 },
        ];
        craters.forEach((c) => {
          ctx.beginPath();
          ctx.arc(c.cx, c.cy, c.cr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 180, 175, ${moonOpacity * 0.4})`;
          ctx.fill();
        });
      }

      // Sun (day / morning / evening)
      if (currentPhase === "day" || currentPhase === "morning" || currentPhase === "evening") {
        const sunOpacity = currentPhase === "day" ? 0.9 : currentPhase === "morning" ? 0.7 : 0.8;
        // Position sun based on phase
        let sx: number, sy: number;
        if (currentPhase === "morning") {
          sx = w * 0.85;
          sy = h * 0.35;
        } else if (currentPhase === "evening") {
          sx = w * 0.15;
          sy = h * 0.45;
        } else {
          sx = w * 0.85;
          sy = h * 0.12;
        }
        const sr = Math.min(w, h) * 0.035;

        // Sun aura
        const aura = ctx.createRadialGradient(sx, sy, sr, sx, sy, sr * 8);
        aura.addColorStop(0, `rgba(255, 230, 150, ${0.2 * sunOpacity})`);
        aura.addColorStop(0.3, `rgba(255, 200, 100, ${0.08 * sunOpacity})`);
        aura.addColorStop(1, "transparent");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(sx, sy, sr * 8, 0, Math.PI * 2);
        ctx.fill();

        // Rays (subtle rotating)
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(t * 0.1);
        for (let i = 0; i < 12; i++) {
          ctx.rotate((Math.PI * 2) / 12);
          const rayLen = sr * (2.5 + Math.sin(t * 0.5 + i) * 0.5);
          const rayGrad = ctx.createLinearGradient(0, 0, rayLen, 0);
          rayGrad.addColorStop(0, `rgba(255, 220, 100, ${0.15 * sunOpacity})`);
          rayGrad.addColorStop(1, "transparent");
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(sr * 1.1, -1.5);
          ctx.lineTo(rayLen, 0);
          ctx.lineTo(sr * 1.1, 1.5);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Sun body
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        const sunGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sunGrad.addColorStop(0, `rgba(255, 250, 220, ${sunOpacity})`);
        sunGrad.addColorStop(0.6, `rgba(255, 220, 120, ${sunOpacity})`);
        sunGrad.addColorStop(1, `rgba(255, 180, 60, ${sunOpacity * 0.8})`);
        ctx.fillStyle = sunGrad;
        ctx.fill();
      }

      // Shooting star (rare, night only)
      if (currentPhase === "night" && Math.random() < 0.002) {
        const sx = Math.random() * w * 0.8;
        const sy = Math.random() * h * 0.4;
        const angle = Math.PI / 4 + Math.random() * 0.3;
        const len = 60 + Math.random() * 80;
        const grad = ctx.createLinearGradient(sx, sy, sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        grad.addColorStop(0, "rgba(255,255,255,0.8)");
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(angle) * len, sy + Math.sin(angle) * len);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [generateStars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[-1] transition-opacity duration-1000"
      style={{ opacity: 1 }}
    />
  );
}
