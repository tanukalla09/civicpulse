'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ActivityCalendarProps {
  // Map of YYYY-MM-DD -> count of actions
  activityData?: Record<string, number>;
  title?: string;
  subtitle?: string;
}

export default function ActivityCalendar({
  activityData = {},
  title = 'Civic Activity Calendar',
  subtitle = 'Track your daily contributions to the city ecosystem',
}: ActivityCalendarProps) {
  // Generate dates for the last 53 weeks, ending today, aligned to start on a Sunday
  const { gridData, months } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // We want 53 weeks. 53 * 7 = 371 days.
    // Start from the Sunday of 52 weeks ago.
    const start = new Date(today);
    start.setDate(today.getDate() - 364 - dayOfWeek);
    
    const dates: Date[] = [];
    const temp = new Date(start);
    
    while (temp <= today) {
      dates.push(new Date(temp));
      temp.setDate(temp.getDate() + 1);
    }
    
    // Group into weeks (arrays of 7 days)
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    dates.forEach((date) => {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      // Pad the last week to 7 days if necessary (though it shouldn't be since we went up to today)
      while (currentWeek.length < 7) {
        const nextDay = new Date(currentWeek[currentWeek.length - 1]);
        nextDay.setDate(nextDay.getDate() + 1);
        currentWeek.push(nextDay);
      }
      weeks.push(currentWeek);
    }

    // Determine month label placements
    const monthLabels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, colIndex) => {
      const firstDayOfWeek = week[0];
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        const label = firstDayOfWeek.toLocaleString('default', { month: 'short' });
        monthLabels.push({ label, colIndex });
        lastMonth = month;
      }
    });

    return { weeks, months: monthLabels };
  }, []);

  // Helper to get color class based on contribution count
  const getColorClass = (count: number) => {
    if (!count || count === 0) return 'bg-slate-800/40 hover:bg-slate-700/60 border border-white/5';
    if (count <= 2) return 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/10';
    if (count <= 4) return 'bg-amber-500/40 hover:bg-amber-500/50 border border-amber-500/20';
    if (count <= 6) return 'bg-amber-500/75 hover:bg-amber-500/85 border border-amber-500/30';
    return 'bg-amber-500 hover:bg-amber-400 border border-amber-400/50';
  };

  // Format date to YYYY-MM-DD
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
      <div className="mb-4">
        <h4 className="text-lg font-bold text-slate-100 font-heading">
          {title}
        </h4>
        <p className="text-xs text-slate-400 font-sans">
          {subtitle}
        </p>
      </div>

      {/* Grid Container with horizontal scroll on small screens */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="min-w-[760px] flex flex-col">
          {/* Months Labels */}
          <div className="flex text-[10px] text-slate-500 font-bold mb-1 h-4 relative pl-8">
            {months.map((m, idx) => (
              <div
                key={`${m.label}-${idx}`}
                className="absolute"
                style={{ left: `${(m.colIndex * 13) + 32}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Days of week labels */}
            <div className="flex flex-col justify-between text-[9px] text-slate-500 font-bold py-1 w-6 h-[91px]">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {gridData.map((week, colIdx) => (
                <div key={`col-${colIdx}`} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const dateStr = formatDateString(day);
                    const count = activityData[dateStr] || 0;
                    const colorClass = getColorClass(count);
                    const formattedDate = day.toLocaleDateString('default', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <div
                        key={dateStr}
                        className={`w-[10px] h-[10px] rounded-[2px] transition-all duration-150 relative group ${colorClass}`}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                          <div className="bg-slate-950 text-slate-100 text-[10px] font-semibold py-1 px-2 rounded-lg border border-white/10 shadow-xl whitespace-nowrap">
                            <span className="font-bold text-amber-400">{count} actions</span> on {formattedDate}
                          </div>
                          {/* Arrow */}
                          <div className="w-1.5 h-1.5 bg-slate-950 border-r border-b border-white/10 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-[4px]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-500 font-semibold mt-4">
        <span>Less</span>
        <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-800/40 border border-white/5" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-500/20 border border-amber-500/10" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-500/40 border border-amber-500/20" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-500/75 border border-amber-500/30" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-500 border border-amber-400/50" />
        <span>More</span>
      </div>
    </div>
  );
}
