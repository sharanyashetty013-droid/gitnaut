import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Flame, Target, Trophy } from 'lucide-react';
import {
  getAggregatedStats,
  subscribeToActivity,
  formatDateToLocalStr,
  getLocalTodayDateStr,
} from '../utils/activityEvents';

interface StarDay {
  dateStr: string;
  dayOfWeek: number;
  weekIdx: number;
  count: number;
  isToday: boolean;
  isFuture: boolean;
  xPercent: number;
  yPercent: number;
}

export const StarMap: React.FC = () => {
  const [stats, setStats] = useState(() => getAggregatedStats());
  const [activeTooltip, setActiveTooltip] = useState<{
    dateStr: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToActivity(() => {
      setStats(getAggregatedStats());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalWeeks = isMobile ? 8 : 12;

  const { days, constellationLines, activeDaysInPeriod } = useMemo(() => {
    const resultDays: StarDay[] = [];
    const todayStr = getLocalTodayDateStr();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDayOfWeek = (today.getDay() + 6) % 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDayOfWeek - (totalWeeks - 1) * 7);

    let activeCount = 0;
    const activeDayIndices: number[] = [];

    for (let w = 0; w < totalWeeks; w++) {
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + w * 7 + d);
        const dateStr = formatDateToLocalStr(currentDate);
        const isFuture = currentDate > today;
        const isToday = dateStr === todayStr;
        const count = isFuture ? 0 : (stats.eventsByDate[dateStr] || 0);

        if (count > 0) {
          activeCount++;
          activeDayIndices.push(resultDays.length);
        }

        const xPercent = (w / (totalWeeks - 1)) * 100;
        const yPercent = (d / 6) * 100;

        resultDays.push({
          dateStr,
          dayOfWeek: d,
          weekIdx: w,
          count,
          isToday,
          isFuture,
          xPercent,
          yPercent,
        });
      }
    }

    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < activeDayIndices.length - 1; i++) {
      const idxA = activeDayIndices[i];
      const idxB = activeDayIndices[i + 1];
      const dayA = resultDays[idxA];
      const dayB = resultDays[idxB];

      const dateA = new Date(dayA.dateStr);
      const dateB = new Date(dayB.dateStr);
      const diffDays = Math.round((dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        lines.push({
          x1: dayA.xPercent,
          y1: dayA.yPercent,
          x2: dayB.xPercent,
          y2: dayB.yPercent,
        });
      }
    }

    return {
      days: resultDays,
      constellationLines: lines,
      activeDaysInPeriod: activeCount,
    };
  }, [totalWeeks, stats.eventsByDate]);

  const handleStarInteract = (day: StarDay, e: React.MouseEvent | React.TouchEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      setActiveTooltip({
        dateStr: day.dateStr,
        count: day.count,
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    }
  };

  const getStarStyle = (count: number, isToday: boolean) => {
    if (count === 0) {
      return {
        size: isToday ? 'w-2.5 h-2.5' : 'w-2 h-2',
        color: isToday ? 'bg-surface-2 border border-accent' : 'bg-surface-2 border border-border/80',
      };
    } else if (count === 1) {
      return {
        size: 'w-2.5 h-2.5',
        color: 'bg-accent shadow-xs',
      };
    } else if (count <= 3) {
      return {
        size: 'w-3 h-3',
        color: 'bg-accent ring-2 ring-accent/30',
      };
    } else {
      return {
        size: 'w-3.5 h-3.5',
        color: 'bg-accent-hover ring-2 ring-accent/50',
      };
    }
  };

  return (
    <section 
      aria-label={`Your streak: ${activeDaysInPeriod} active days in the last ${totalWeeks} weeks`}
      className="card-base p-4 sm:p-6 space-y-5 font-sans relative overflow-hidden min-w-0"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan">
            Activity Constellation • Last {totalWeeks} Weeks
          </div>
          <div className="flex items-baseline gap-3 pt-0.5">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-normal flex items-center gap-2">
              <Flame className={`w-6 h-6 ${stats.streak > 0 ? 'text-accent fill-accent' : 'text-text-muted'}`} strokeWidth={1.75} />
              <span>{stats.streak > 0 ? `${stats.streak}-day streak` : 'Activity Map'}</span>
            </h3>
            <span className="text-sm text-text-muted font-medium">
              {stats.streak > 0 ? `${stats.streak} consecutive active days` : 'Interactive history constellation'}
            </span>
          </div>
        </div>

        {/* Weekly Target Chip */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-[10px] bg-surface-2 border border-border text-sm">
          <Target className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />
          <div>
            <span className="text-text-muted block text-xs uppercase tracking-wider font-semibold">Weekly Target</span>
            <span className="font-bold text-text">
              {stats.weeklyActiveDays} of 5 days this week
            </span>
          </div>
        </div>
      </div>

      {/* Milestones Strip */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-sm pt-1">
        <span className="text-text-muted font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 mr-1">
          <Trophy className="w-4 h-4 text-accent" strokeWidth={1.75} />
          Milestones:
        </span>
        {[
          { days: 7, label: '7-Day Explorer', reached: stats.milestones[7] },
          { days: 14, label: '14-Day Pilot', reached: stats.milestones[14] },
          { days: 30, label: '30-Day Astronaut', reached: stats.milestones[30] },
        ].map((m) => (
          <div
            key={m.days}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] border text-xs font-semibold transition-all ${
              m.reached
                ? 'bg-accent/15 border-accent/60 text-accent font-bold'
                : 'bg-surface-2 border-border text-text-muted'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${m.reached ? 'bg-accent' : 'bg-border'}`} />
            <span>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Main Star Map Canvas & Grid */}
      <div 
        ref={containerRef}
        onMouseLeave={() => setActiveTooltip(null)}
        className="w-full relative py-4 select-none"
      >
        <div className="w-full relative h-[140px] sm:h-[160px] bg-surface-2/60 border border-border rounded-[12px] p-3 sm:p-4 overflow-hidden">
          {/* Constellation SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 px-4 py-4" style={{ overflow: 'visible' }}>
            {constellationLines.map((line, idx) => (
              <line
                key={idx}
                x1={`${line.x1}%`}
                y1={`${line.y1}%`}
                x2={`${line.x2}%`}
                y2={`${line.y2}%`}
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeOpacity="0.45"
              />
            ))}
          </svg>

          {/* Stars Placed in 7-day Rows */}
          <div className="relative w-full h-full z-20">
            {days.map((day, idx) => {
              const style = getStarStyle(day.count, day.isToday);
              return (
                <div
                  key={idx}
                  onMouseEnter={(e) => handleStarInteract(day, e)}
                  onTouchStart={(e) => handleStarInteract(day, e)}
                  style={{
                    left: `${day.xPercent}%`,
                    top: `${day.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute rounded-full cursor-pointer transition-transform hover:scale-150 ${style.size} ${style.color}`}
                />
              );
            })}
          </div>

          {/* Active Tooltip */}
          {activeTooltip && (
            <div
              style={{
                left: `${activeTooltip.x}px`,
                top: `${activeTooltip.y - 48}px`,
                transform: 'translateX(-50%)',
              }}
              className="absolute z-30 pointer-events-none px-3 py-1.5 rounded-[8px] bg-surface border border-border text-xs text-text shadow-xl whitespace-nowrap"
            >
              <div className="font-semibold text-text">{activeTooltip.dateStr}</div>
              <div className="text-text-muted">
                {activeTooltip.count === 0
                  ? 'No activity'
                  : `${activeTooltip.count} lesson${activeTooltip.count > 1 ? 's' : ''} mastered`}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-text-muted pt-3">
          <span>{totalWeeks} weeks ago</span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-surface-2 border border-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent opacity-60" />
              <span className="w-3 h-3 rounded-full bg-accent" />
            </div>
            <span>More</span>
          </div>
          <span>Today</span>
        </div>
      </div>
    </section>
  );
};
