"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function DigitalClock() {
  const [time, setTime] = useState<Date | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const pad = (n: number) => String(n).padStart(2, "0");

  // Colors driven by the explicitly set theme, not time-of-day
  const isDark = theme === "dark";

  const primaryColor   = isDark ? "rgba(220,230,255,0.92)" : "rgba(15,15,30,0.80)";
  const secondaryColor = isDark ? "rgba(180,195,240,0.65)" : "rgba(15,15,30,0.45)";
  const mutedColor     = isDark ? "rgba(160,175,220,0.45)" : "rgba(15,15,30,0.30)";
  const textShadow     = isDark
    ? "0 0 14px rgba(140,170,255,0.45), 0 1px 6px rgba(0,0,0,0.40)"
    : "0 1px 8px rgba(255,255,255,0.60), 0 1px 4px rgba(0,0,0,0.12)";

  const toggleBg   = isDark ? "rgba(15,20,50,0.55)" : "rgba(255,255,255,0.55)";
  const toggleHover = isDark ? "rgba(30,40,80,0.75)" : "rgba(255,255,255,0.80)";
  const toggleBorder = isDark ? "rgba(120,150,220,0.25)" : "rgba(0,0,0,0.10)";
  const toggleColor  = isDark ? "rgba(200,215,255,0.90)" : "rgba(40,40,60,0.80)";

  const toggleButton = (extraClass = "") => (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={theme === "light" ? "Switch to night mode" : "Switch to day mode"}
      className={`pointer-events-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] md:text-xs font-semibold backdrop-blur-md transition-all duration-300 ${extraClass}`}
      style={{
        background: toggleBg,
        border: `1px solid ${toggleBorder}`,
        color: toggleColor,
        boxShadow: isDark
          ? "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.70)",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = toggleHover)}
      onMouseLeave={e => (e.currentTarget.style.background = toggleBg)}
    >
      {theme === "light" ? <Moon size={11} strokeWidth={2.2} /> : <Sun size={11} strokeWidth={2.2} />}
      {theme === "light" ? "Night" : "Day"}
    </button>
  );

  return (
    <>
      {/* Mobile-only: toggle pinned top-left */}
      <div className="fixed top-3 left-3 z-50 md:hidden">
        {toggleButton()}
      </div>

      {/* Clock + date + desktop toggle — top-right */}
      <div className="fixed top-3 right-3 z-50 select-none md:top-5 md:right-5 flex flex-col items-end gap-1.5">
        {/* Clock digits */}
        <div className="flex items-baseline gap-1 font-mono tracking-tight" style={{ textShadow }}>
          <span className="text-lg md:text-3xl font-bold transition-colors duration-500" style={{ color: primaryColor }}>
            {pad(h12)}
          </span>
          <span className="text-lg md:text-3xl font-bold animate-pulse transition-colors duration-500" style={{ color: secondaryColor }}>
            :
          </span>
          <span className="text-lg md:text-3xl font-bold transition-colors duration-500" style={{ color: primaryColor }}>
            {pad(minutes)}
          </span>
          <span className="text-xs md:text-lg font-bold ml-0.5 transition-colors duration-500" style={{ color: secondaryColor }}>
            {pad(seconds)}
          </span>
          <span className="text-[9px] md:text-xs font-semibold ml-1 transition-colors duration-500" style={{ color: mutedColor }}>
            {ampm}
          </span>
        </div>

        {/* Date label */}
        <div
          className="text-[8px] md:text-[10px] font-medium text-right uppercase tracking-widest transition-colors duration-500"
          style={{ color: mutedColor }}
        >
          {time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
        </div>

        {/* Desktop-only: toggle below the clock */}
        <div className="hidden md:block mt-0.5">
          {toggleButton()}
        </div>
      </div>
    </>
  );
}

