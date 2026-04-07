"use client";

import { useState, useEffect } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState<Date | null>(null);

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

  // Determine if it's daytime for styling
  const isDaytime = hours >= 6 && hours < 19;

  return (
    <div className="fixed top-14 md:top-5 right-3 md:right-5 z-50 select-none pointer-events-none">
      <div
        className="flex items-baseline gap-1 font-mono tracking-tight"
        style={{
          textShadow: isDaytime
            ? "0 1px 8px rgba(0,0,0,0.15)"
            : "0 0 12px rgba(180,200,255,0.4), 0 1px 6px rgba(0,0,0,0.3)",
        }}
      >
        <span
          className="text-lg md:text-3xl font-bold transition-colors duration-[2000ms]"
          style={{ color: isDaytime ? "rgba(30,30,30,0.75)" : "rgba(220,225,240,0.85)" }}
        >
          {pad(h12)}
        </span>
        <span
          className="text-lg md:text-3xl font-bold animate-pulse transition-colors duration-[2000ms]"
          style={{ color: isDaytime ? "rgba(30,30,30,0.5)" : "rgba(220,225,240,0.6)" }}
        >
          :
        </span>
        <span
          className="text-lg md:text-3xl font-bold transition-colors duration-[2000ms]"
          style={{ color: isDaytime ? "rgba(30,30,30,0.75)" : "rgba(220,225,240,0.85)" }}
        >
          {pad(minutes)}
        </span>
        <span
          className="text-xs md:text-lg font-bold ml-0.5 transition-colors duration-[2000ms]"
          style={{ color: isDaytime ? "rgba(30,30,30,0.4)" : "rgba(220,225,240,0.5)" }}
        >
          {pad(seconds)}
        </span>
        <span
          className="text-[9px] md:text-xs font-semibold ml-1 transition-colors duration-[2000ms]"
          style={{ color: isDaytime ? "rgba(30,30,30,0.4)" : "rgba(220,225,240,0.45)" }}
        >
          {ampm}
        </span>
      </div>
      <div
        className="text-[8px] md:text-[10px] font-medium text-right mt-0.5 uppercase tracking-widest transition-colors duration-[2000ms]"
        style={{ color: isDaytime ? "rgba(30,30,30,0.3)" : "rgba(220,225,240,0.3)" }}
      >
        {time.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
      </div>
    </div>
  );
}
