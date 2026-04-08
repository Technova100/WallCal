"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Trash2, Plus, CheckCircle, Circle, X, Save } from "lucide-react";
import { cn, formatDate, formatShortDate, MONTH_DATA, HOLIDAYS, FESTIVALS } from "@/lib/utils";
import { useTheme } from "./ThemeContext";
import BorderGlow from "./BorderGlow";

interface RangeSelect {
  start: string | null;
  end: string | null;
}

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface SavedRangeNote {
  id: string;
  start: string;
  end: string;
  text: string;
  savedAt: number;
}

// --- Icons / Components ---
export default function WallCal() {
  // 1. Core State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { theme } = useTheme();
  const [selectedRange, setSelectedRange] = useState<RangeSelect>({ start: null, end: null });
  const [monthlyNotes, setMonthlyNotes] = useState<Record<string, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});
  const [dayNotes, setDayNotes] = useState<Record<string, string>>({});
  const [noteMode, setNoteMode] = useState<"text" | "checklist">("text");
  const [monthlyChecklists, setMonthlyChecklists] = useState<Record<string, ChecklistItem[]>>({});
  const [savedRangeNotes, setSavedRangeNotes] = useState<SavedRangeNote[]>([]);
  const [rangeNoteInput, setRangeNoteInput] = useState("");

  // Mounted / Transition states
  const [isMounted, setIsMounted] = useState(false);
  const [animatingDir, setAnimatingDir] = useState<"left" | "right" | null>(null);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [tempDayNote, setTempDayNote] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. Init & Hooks
  useEffect(() => {
    setIsMounted(true);
    // Load from local storage
    try {
      const loadedCurMonth = localStorage.getItem("wallcal_currentMonth");
      if (loadedCurMonth) setCurrentDate(new Date(`${loadedCurMonth}-01T00:00:00`));

      const loadJSON = (key: string) => {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : null;
      };

      setMonthlyNotes(loadJSON("wallcal_monthlyNotes") || {});
      setRangeNotes(loadJSON("wallcal_rangeNotes") || {});
      setDayNotes(loadJSON("wallcal_dayNotes") || {});
      setSelectedRange(loadJSON("wallcal_selectedRange") || { start: null, end: null });
      setMonthlyChecklists(loadJSON("wallcal_monthlyChecklists") || {});
      setSavedRangeNotes(loadJSON("wallcal_savedRangeNotes") || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save specific keys directly
  const saveToStorage = useCallback((key: string, value: any) => {
    try {
      if (typeof value === "string") {
        localStorage.setItem(`wallcal_${key}`, value);
      } else {
        localStorage.setItem(`wallcal_${key}`, JSON.stringify(value));
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        setToastMessage("Storage unavailable — notes won't be saved.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  }, []);

  // Sync theme
  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    saveToStorage("theme", theme);
  }, [theme, isMounted, saveToStorage]);

  // Sync basic state on change
  useEffect(() => {
    if (!isMounted) return;
    saveToStorage("currentMonth", formatDate(currentDate).slice(0, 7));
  }, [currentDate, isMounted, saveToStorage]);

  useEffect(() => {
    if (!isMounted) return;
    saveToStorage("selectedRange", selectedRange);
  }, [selectedRange, isMounted, saveToStorage]);

  // Sync notes with debounce
  useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => saveToStorage("monthlyNotes", monthlyNotes), 500);
    return () => clearTimeout(t);
  }, [monthlyNotes, isMounted, saveToStorage]);

  useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => saveToStorage("rangeNotes", rangeNotes), 500);
    return () => clearTimeout(t);
  }, [rangeNotes, isMounted, saveToStorage]);

  useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => saveToStorage("dayNotes", dayNotes), 500);
    return () => clearTimeout(t);
  }, [dayNotes, isMounted, saveToStorage]);

  useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => saveToStorage("monthlyChecklists", monthlyChecklists), 500);
    return () => clearTimeout(t);
  }, [monthlyChecklists, isMounted, saveToStorage]);

  useEffect(() => {
    if (!isMounted) return;
    const t = setTimeout(() => saveToStorage("savedRangeNotes", savedRangeNotes), 500);
    return () => clearTimeout(t);
  }, [savedRangeNotes, isMounted, saveToStorage]);



  // 3. Derived Helpers
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`; // "YYYY-MM"

  const currentMonthData = MONTH_DATA[monthIndex];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(year, monthIndex);

  // 0 = Sunday, 1 = Monday. We want Monday=0, Sunday=6
  const getFirstDayOfMonth = (y: number, m: number) => {
    let day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };
  const firstDay = getFirstDayOfMonth(year, monthIndex);

  const prevMonthDays = getDaysInMonth(year, monthIndex - 1);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const gridCells = useMemo(() => {
    const cells = [];
    let pDay = prevMonthDays - firstDay + 1;
    // prev
    for (let i = 0; i < firstDay; i++) {
      const dStr = formatDate(new Date(year, monthIndex - 1, pDay));
      cells.push({ dateStr: dStr, day: pDay++, isCurrentMonth: false });
    }
    // cur
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = formatDate(new Date(year, monthIndex, i));
      cells.push({ dateStr: dStr, day: i, isCurrentMonth: true });
    }
    // next
    let nDay = 1;
    while (cells.length < Math.max(42, totalCells)) {
      const dStr = formatDate(new Date(year, monthIndex + 1, nDay));
      cells.push({ dateStr: dStr, day: nDay++, isCurrentMonth: false });
    }
    return cells;
  }, [year, monthIndex, firstDay, daysInMonth, prevMonthDays, totalCells]);

  // Handle Month changes
  const prevMonth = () => {
    setAnimatingDir("right");
    setTimeout(() => {
      setCurrentDate(new Date(year, monthIndex - 1, 1));
      setAnimatingDir(null);
    }, 150); // half transition
  };

  const nextMonth = () => {
    setAnimatingDir("left");
    setTimeout(() => {
      setCurrentDate(new Date(year, monthIndex + 1, 1));
      setAnimatingDir(null);
    }, 150);
  };

  // Keyboard Nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "TEXTAREA" || (e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowLeft") prevMonth();
      if (e.key === "ArrowRight") nextMonth();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [year, monthIndex]);

  // Selection Logic
  const handleDateClick = (dateStr: string) => {
    setActivePopover(null);

    // Condition 1: selection is full -> reset to new start
    if (selectedRange.start && selectedRange.end) {
      setSelectedRange({ start: dateStr, end: null });
      return;
    }

    // Condition 2: exactly start is selected
    if (selectedRange.start && !selectedRange.end) {
      if (selectedRange.start === dateStr) {
        // click start again clears
        setSelectedRange({ start: null, end: null });
      } else if (dateStr < selectedRange.start) {
        // click before -> new start, old start is end
        setSelectedRange({ start: dateStr, end: selectedRange.start });
      } else {
        // click after -> end
        setSelectedRange({ start: selectedRange.start, end: dateStr });
      }
      return;
    }

    // Default: no selection
    setSelectedRange({ start: dateStr, end: null });
  };

  // Double click / Long press for day note
  let touchTimer: NodeJS.Timeout;
  const handleTouchStart = (dateStr: string) => {
    touchTimer = setTimeout(() => {
      openPopover(dateStr);
    }, 500);
  };
  const handleTouchEnd = () => clearTimeout(touchTimer);

  const openPopover = (dateStr: string) => {
    setActivePopover(dateStr);
    setTempDayNote(dayNotes[dateStr] || "");
  };

  const handleSavePopover = () => {
    if (activePopover) {
      if (tempDayNote.trim()) {
        setDayNotes(p => ({ ...p, [activePopover]: tempDayNote.trim() }));
      } else {
        const newData = { ...dayNotes };
        delete newData[activePopover];
        setDayNotes(newData);
      }
    }
    setActivePopover(null);
  };

  const todayStr = formatDate(new Date());

  // Wait until mounted to prevent hydration flash
  if (!isMounted) return null;

  const rangeKey = selectedRange.start && selectedRange.end ? `${selectedRange.start}_${selectedRange.end}` : null;
  const showRangeNote = !!rangeKey;

  const themeColors = theme === 'dark'
    ? ['#c084fc', '#f472b6', '#38bdf8']
    : ['#e07a5f', '#f2cc8f', '#81b29a'];

  return (
    <div
      className="relative z-0 mx-auto w-full max-w-[960px] pt-2 max-h-[calc(100dvh-2.75rem)] sm:pt-3 sm:max-h-[calc(100dvh-4rem)] md:pt-8 md:max-h-[calc(100vh-6rem)]"
      style={{
        "--accent": currentMonthData.accent,
      } as React.CSSProperties}
    >
      {/* === Spiral Wire Binding System === */}
      <div className="absolute top-1 left-1/2 z-50 w-[94%] max-w-[860px] -translate-x-1/2 pointer-events-none md:-top-[6px] md:w-[92%]">
        {/* Horizontal bar strip (calendar edge) */}
        <div className="spiral-bar" />

        {/* Wire coils + center hanging clip */}
        <div className="relative flex items-start justify-between px-1 md:px-2">
          {Array.from({ length: 23 }).map((_, i) => {
            // Center position (index 11) gets the hanging clip
            if (i === 11) {
              return (
                <div key={i} className="hanging-clip">
                  <div className="hanging-clip-wire hidden md:block" />
                  <div className="hanging-hole hidden md:block" />

                  <div className="hanging-clip-mobile md:hidden">
                    <div className="hanging-clip-mobile-wire" />
                    <div className="hanging-clip-mobile-rail hanging-clip-mobile-rail-left" />
                    <div className="hanging-clip-mobile-rail hanging-clip-mobile-rail-right" />
                    <div className="hanging-hole-mobile" />
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className="spiral-coil">
                <span className="spiral-coil-highlight" />
              </div>
            );
          })}
        </div>
      </div>

      <BorderGlow
        className="w-full text-text-primary shadow-custom transition-colors-custom"
        borderRadius={12}
        backgroundColor="var(--surface)"
        colors={themeColors}
        animated={true}
      >
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-surface-secondary px-4 py-2 rounded shadow-custom z-50 text-sm">
            {toastMessage}
          </div>
        )}

        {/* Header / Hero */}
        <div className="relative h-[16vh] min-h-[110px] w-full shrink-0 overflow-hidden md:h-[24vh] md:min-h-[180px]">

          {/* Img with crossfade effect simplified via absolute images (in ideal, robust way, but simple transition here) */}
          <div className="absolute inset-0 transition-opacity duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentMonthData.image} alt="Month visual" className="w-full h-full object-cover" />
          </div>

          {/* Month/Year Badge */}
          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black/40 backdrop-blur-md text-white font-bold text-sm md:text-xl px-2 py-1 md:px-4 md:py-2 rounded select-none">
            {year} / {currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row w-full bg-surface">

          {/* Calendar Column */}
          <div className="flex-1 p-2 md:p-4 w-full md:w-[60%] flex flex-col relative overflow-visible">
            {/* Nav */}
            <div className="flex items-center justify-between mb-1 md:mb-2 px-1 md:px-2">
              <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 hover:dark:bg-white/10 transition-all duration-150 hover:scale-110 active:scale-95">
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="relative flex items-center bg-accent/5 hover:bg-accent/15 border border-accent/10 dark:border-white/5 rounded-md px-2 py-0.5 transition-colors cursor-pointer group shadow-sm">
                  <select
                    value={currentDate.getMonth()}
                    onChange={(e) => {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(parseInt(e.target.value));
                      setCurrentDate(newDate);
                    }}
                    className="bg-transparent font-bold text-[17px] cursor-pointer outline-none text-text-primary border-none appearance-none pr-5 z-10 w-full"
                  >
                    {Array.from({ length: 12 }).map((_, i) => {
                      const d = new Date(2020, i, 1);
                      const monthName = d.toLocaleString('default', { month: 'long' });
                      return <option key={i} value={i} className="text-black font-medium">{monthName}</option>;
                    })}
                  </select>
                  <div className="absolute right-1.5 text-text-primary pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
                <div className="relative flex items-center bg-accent/5 hover:bg-accent/15 border border-accent/10 dark:border-white/5 rounded-md px-2 py-0.5 transition-colors cursor-pointer group shadow-sm">
                  <select
                    value={year}
                    onChange={(e) => {
                      const newDate = new Date(currentDate);
                      newDate.setFullYear(parseInt(e.target.value));
                      setCurrentDate(newDate);
                    }}
                    className="bg-transparent font-bold text-[17px] cursor-pointer outline-none text-accent border-none appearance-none pr-5 z-10 w-full"
                  >
                    {Array.from({ length: 11 }).map((_, i) => {
                      const yr = 2023 + i; // 2023 to 2033
                      return <option key={yr} value={yr} className="text-black font-medium">{yr}</option>;
                    })}
                  </select>
                  <div className="absolute right-1.5 text-accent pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
              </div>
              <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 hover:dark:bg-white/10 transition-all duration-150 hover:scale-110 active:scale-95">
                <ChevronRight size={20} />
              </button>
            </div>

            <div
              className={cn(
                "flex-1 flex flex-col transition-all duration-300 transform",
                animatingDir === "left" && "-translate-x-8 opacity-0",
                animatingDir === "right" && "translate-x-8 opacity-0",
                !animatingDir && "translate-x-0 opacity-100"
              )}
            >
              {/* Headers */}
              <div className="grid grid-cols-7 gap-0 mb-1 md:mb-2">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                  <div key={day} className={cn(
                    "text-center text-[11px] font-semibold",
                    (i === 5 || i === 6) ? "text-accent" : "text-text-secondary"
                  )}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 grid-rows-6 gap-y-0">
                {gridCells.map((cell, idx) => {
                  const isSelectedStart = cell.dateStr === selectedRange.start;
                  const isSelectedEnd = cell.dateStr === selectedRange.end;
                  const inRange = selectedRange.start && selectedRange.end && cell.dateStr > selectedRange.start && cell.dateStr < selectedRange.end;
                  const isToday = cell.dateStr === todayStr;
                  const isWeekend = idx % 7 === 5 || idx % 7 === 6;
                  const hasNote = !!dayNotes[cell.dateStr];

                  const mdStr = cell.dateStr.slice(5); // MM-DD
                  const staticH = HOLIDAYS[mdStr];
                  const dynamicH = FESTIVALS[cell.dateStr];
                  const holdayName = [staticH, dynamicH].filter(Boolean).join(" / ");

                  return (
                    <div
                      key={cell.dateStr}
                      className="relative flex items-center justify-center min-h-[28px] md:min-h-[38px] group"
                    >
                      {/* In-Range Band Background */}
                      {inRange && cell.isCurrentMonth && (
                        <div className="absolute inset-0 bg-accent-15 w-full h-[36px] top-1/2 -translate-y-1/2"></div>
                      )}
                      {isSelectedStart && selectedRange.end && cell.isCurrentMonth && (
                        <div className="absolute left-1/2 right-0 bg-accent-15 h-[36px] top-1/2 -translate-y-1/2"></div>
                      )}
                      {isSelectedEnd && selectedRange.start && cell.isCurrentMonth && (
                        <div className="absolute left-0 right-1/2 bg-accent-15 h-[36px] top-1/2 -translate-y-1/2"></div>
                      )}

                      {/* The Cell Button */}
                      <button
                        className={cn(
                          "relative w-[26px] h-[26px] md:w-9 md:h-9 text-[12px] md:text-[13px] flex items-center justify-center font-medium text-[13px] z-10 transition-all duration-150 ease-out",
                          !cell.isCurrentMonth ? "opacity-30 cursor-default rounded-full" : "cursor-pointer hover:scale-105 active:scale-95",
                          cell.isCurrentMonth && !isSelectedStart && !isSelectedEnd && "hover:bg-accent-10 rounded-full",
                          cell.isCurrentMonth && holdayName && !isSelectedStart && !isSelectedEnd && "text-holiday font-bold bg-[color-mix(in_srgb,var(--color-holiday)_12%,transparent)] border border-[color-mix(in_srgb,var(--color-holiday)_30%,transparent)] rounded-md shadow-sm",
                          cell.isCurrentMonth && isSelectedStart && selectedRange.end ? "bg-accent text-white rounded-l-full rounded-r-sm" :
                            cell.isCurrentMonth && isSelectedStart ? "bg-accent text-white rounded-full" : "",
                          cell.isCurrentMonth && isSelectedEnd ? "bg-accent text-white rounded-r-full rounded-l-sm" : "",
                          cell.isCurrentMonth && !isSelectedStart && !isSelectedEnd && isWeekend && !holdayName && "text-accent",
                          !isSelectedStart && !isSelectedEnd && isToday && "bg-emerald-500 text-white font-bold rounded-full shadow-md"
                        )}
                        style={{
                          boxShadow: (isSelectedStart || isSelectedEnd) ? `0 2px 8px color-mix(in srgb, var(--accent) 30%, transparent)` : 'none'
                        }}
                        onClick={() => cell.isCurrentMonth && handleDateClick(cell.dateStr)}
                        onDoubleClick={() => cell.isCurrentMonth && openPopover(cell.dateStr)}
                        onTouchStart={() => cell.isCurrentMonth && handleTouchStart(cell.dateStr)}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchEnd}
                        disabled={!cell.isCurrentMonth}
                        aria-label={`Date: ${cell.dateStr}`}
                      >
                        {cell.day}
                      </button>

                      {/* Indicators & Tooltip */}
                      {cell.isCurrentMonth && (
                        <>
                          {hasNote && (
                            <div className="absolute bottom-0 md:-bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-text-secondary rounded-full"></div>
                          )}
                          {holdayName && (
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-bg-primary border border-border-custom text-text-primary shadow-lg text-[11px] font-bold px-2.5 py-1 rounded-[6px] pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150">
                              {holdayName}
                            </div>
                          )}
                        </>
                      )}

                      {/* Popover */}
                      {activePopover === cell.dateStr && (
                        <div className={cn("absolute left-1/2 -translate-x-1/2 z-50 bg-bg-primary border border-border-custom shadow-custom rounded-radius-md p-3 w-[200px] md:w-[240px]", idx > 27 ? "bottom-full mb-2" : "top-full mt-2")}>
                          <label className="block text-xs uppercase text-text-secondary mb-2 whitespace-nowrap font-bold tracking-wide">Note for {cell.dateStr}</label>
                          <textarea
                            autoFocus
                            maxLength={140}
                            rows={2}
                            className="w-full text-sm bg-surface p-2 rounded border border-border-custom text-text-primary outline-none focus:border-accent"
                            value={tempDayNote}
                            onChange={e => setTempDayNote(e.target.value)}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-text-muted">{tempDayNote.length}/140</span>
                            <div className="flex gap-2">
                              <button className="text-xs font-semibold px-2 py-1 rounded border border-border-custom hover:bg-surface-secondary" onClick={() => setActivePopover(null)}>Cancel</button>
                              <button className="text-xs font-semibold px-2 py-1 rounded bg-accent text-white" onClick={handleSavePopover}>Save</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes Column */}
          <div className="w-full md:w-[40%] bg-surface-secondary md:border-l md:border-border-custom p-2 md:p-4 flex flex-col gap-2 md:gap-4 max-h-[30vh] md:max-h-none overflow-y-auto styled-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Monthly Notes */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold tracking-wide uppercase text-text-secondary opacity-60">
                  Notes for {currentDate.toLocaleString('default', { month: 'long' })}
                </label>
                <div className="flex gap-1 bg-border/20 p-0.5 rounded">
                  <button onClick={() => setNoteMode('text')} className={cn("text-[10px] px-2 py-0.5 rounded transition-colors font-medium", noteMode === 'text' ? 'bg-text-secondary text-surface shadow-sm' : 'text-text-secondary hover:text-text-primary')}>Text</button>
                  <button onClick={() => setNoteMode('checklist')} className={cn("text-[10px] px-2 py-0.5 rounded transition-colors font-medium", noteMode === 'checklist' ? 'bg-text-secondary text-surface shadow-sm' : 'text-text-secondary hover:text-text-primary')}>Checklist</button>
                </div>
              </div>

              {noteMode === 'text' ? (
                <>
                  <textarea
                    className="flex-1 bg-transparent border-b border-transparent focus:border-border-custom resize-none outline-none text-sm leading-relaxed text-text-primary placeholder:text-text-muted transition-colors"
                    placeholder={`Notes for ${currentDate.toLocaleString('default', { month: 'long' })}...`}
                    maxLength={500}
                    value={monthlyNotes[monthKey] || ""}
                    onChange={(e) => setMonthlyNotes(p => ({ ...p, [monthKey]: e.target.value }))}
                  />
                  <div className="text-right mt-1 text-[11px] text-text-muted">
                    {(monthlyNotes[monthKey] || "").length} / 500
                  </div>
                </>
              ) : (
                <div className="flex flex-col flex-1 gap-2 overflow-y-auto max-h-[140px] md:max-h-[200px] pr-1 styled-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {(monthlyChecklists[monthKey] || []).map(item => (
                    <div key={item.id} className="flex flex-row items-center gap-2 group">
                      <button onClick={() => {
                        const newArr = (monthlyChecklists[monthKey] || []).map(x => x.id === item.id ? { ...x, done: !x.done } : x);
                        setMonthlyChecklists(p => ({ ...p, [monthKey]: newArr }));
                      }} className="text-text-secondary hover:text-accent flex-shrink-0 transition-colors">
                        {item.done ? <CheckCircle size={16} className="text-accent" /> : <Circle size={16} />}
                      </button>
                      <input
                        type="text"
                        value={item.text}
                        className={cn("flex-1 bg-transparent outline-none text-sm transition-colors border-b focus:border-border-custom border-transparent", item.done ? "line-through text-text-muted opacity-60" : "text-text-primary")}
                        placeholder="Task..."
                        onChange={(e) => {
                          const newArr = (monthlyChecklists[monthKey] || []).map(x => x.id === item.id ? { ...x, text: e.target.value } : x);
                          setMonthlyChecklists(p => ({ ...p, [monthKey]: newArr }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setMonthlyChecklists(p => ({
                              ...p,
                              [monthKey]: [...(p[monthKey] || []), { id: Math.random().toString(), text: "", done: false }]
                            }));
                          }
                        }}
                      />
                      <button onClick={() => {
                        setMonthlyChecklists(p => ({ ...p, [monthKey]: p[monthKey].filter(x => x.id !== item.id) }));
                      }} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-holiday transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => {
                    setMonthlyChecklists(p => ({
                      ...p,
                      [monthKey]: [...(p[monthKey] || []), { id: Math.random().toString(), text: "", done: false }]
                    }));
                  }} className="flex items-center gap-1 text-[11px] font-semibold text-text-secondary hover:text-accent transition-colors mt-1 py-1 w-fit rounded">
                    <Plus size={14} /> Add task
                  </button>
                </div>
              )}
            </div>

            {/* Range Notes — Active + Saved */}
            {showRangeNote && (
              <div className="flex flex-col pt-3 border-t border-border-custom animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="text-[11px] font-bold tracking-wide uppercase text-text-secondary opacity-60 mb-2 flex items-center justify-between">
                  <span>Note for {formatShortDate(selectedRange.start!)} — {formatShortDate(selectedRange.end!)}</span>
                  <button onClick={() => { setSelectedRange({ start: null, end: null }); setRangeNoteInput(""); }} className="hover:text-accent hover:opacity-100 transition-colors" title="Clear selection">
                    <Trash2 size={14} />
                  </button>
                </label>
                <div className="flex gap-2 items-end">
                  <textarea
                    className="flex-1 bg-transparent border-b border-transparent focus:border-border-custom resize-none outline-none text-sm leading-relaxed text-text-primary placeholder:text-text-muted transition-colors"
                    placeholder="Add a note for this range..."
                    maxLength={300}
                    rows={2}
                    value={rangeNoteInput}
                    onChange={(e) => setRangeNoteInput(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      if (!rangeNoteInput.trim() || !selectedRange.start || !selectedRange.end) return;
                      setSavedRangeNotes(prev => [
                        ...prev,
                        { id: Date.now().toString(), start: selectedRange.start!, end: selectedRange.end!, text: rangeNoteInput.trim(), savedAt: Date.now() }
                      ]);
                      setRangeNoteInput("");
                      setSelectedRange({ start: null, end: null });
                      setToastMessage("Range note saved!");
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    disabled={!rangeNoteInput.trim()}
                    className={cn("flex-shrink-0 flex items-center gap-1 text-[11px] font-bold px-4 py-2 rounded-[6px] transition-all", rangeNoteInput.trim() ? "bg-text-primary text-bg-primary hover:bg-holiday hover:text-white shadow-md hover:-translate-y-0.5 cursor-pointer" : "bg-border/30 text-text-muted cursor-not-allowed")}
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
                <div className="text-right mt-1 text-[11px] text-text-muted">
                  {rangeNoteInput.length} / 300
                </div>
              </div>
            )}

            {/* Saved Range Notes */}
            {savedRangeNotes.length > 0 && (
              <div className="flex flex-col pt-3 border-t border-border-custom">
                <label className="text-[11px] font-bold tracking-wide uppercase text-text-secondary opacity-60 mb-2">Saved Range Notes</label>
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[140px] md:max-h-[180px] pr-1 styled-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {savedRangeNotes.map(note => (
                    <div key={note.id} className="flex items-start gap-2 group bg-surface rounded-[6px] px-2.5 py-2 border border-border-custom/50 transition-colors hover:border-border-custom">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-semibold text-accent mb-0.5">
                          {formatShortDate(note.start)} — {formatShortDate(note.end)}
                        </div>
                        <div className="text-sm text-text-primary leading-snug break-words">{note.text}</div>
                      </div>
                      <button onClick={() => setSavedRangeNotes(prev => prev.filter(n => n.id !== note.id))} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-holiday transition-opacity flex-shrink-0 mt-0.5">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </BorderGlow>
    </div>
  );
}
