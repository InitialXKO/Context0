'use client';

import * as React from 'react';
import type { ProgressAttempt } from '../progress-context';

type ChartPoint = {
  dateKey: string;
  label: string;
  completedCount: number;
  inProgressCount: number;
};

const MAX_POINTS = 7;

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

type ProgressChartProps = {
  attempts: ProgressAttempt[];
  hydrated?: boolean;
};

export function ProgressChart({ attempts, hydrated = true }: ProgressChartProps) {
  const data = React.useMemo<ChartPoint[]>(() => {
    if (!attempts.length) {
      return [];
    }

    const aggregated = new Map<string, ChartPoint>();

    for (const attempt of attempts) {
      const date = new Date(attempt.completedAt);
      if (Number.isNaN(date.getTime())) {
        continue;
      }
      const key = date.toISOString().split('T')[0];
      const existing = aggregated.get(key);
      if (existing) {
        if (attempt.status === 'completed') {
          existing.completedCount += 1;
        } else {
          existing.inProgressCount += 1;
        }
      } else {
        aggregated.set(key, {
          dateKey: key,
          label: formatDayLabel(date),
          completedCount: attempt.status === 'completed' ? 1 : 0,
          inProgressCount: attempt.status === 'completed' ? 0 : 1,
        });
      }
    }

    const sorted = Array.from(aggregated.values()).sort(
      (a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime(),
    );

    return sorted.slice(Math.max(0, sorted.length - MAX_POINTS));
  }, [attempts]);

  const maxValue = React.useMemo(() => {
    if (!data.length) {
      return 0;
    }
    return data.reduce((acc, point) => Math.max(acc, point.completedCount + point.inProgressCount), 0);
  }, [data]);

  if (!hydrated) {
    return (
      <div className="progress-chart__empty" role="status" aria-live="polite">
        Loading chart…
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="progress-chart__empty" role="status" aria-live="polite">
        No completion activity recorded yet.
      </div>
    );
  }

  return (
    <div className="progress-chart" role="img" aria-label="Completed practice sessions over time">
      {data.map((point) => {
        const total = point.completedCount + point.inProgressCount;
        const height = maxValue === 0 ? 0 : Math.round((total / maxValue) * 100);
        const completedHeight = maxValue === 0 ? 0 : Math.round((point.completedCount / maxValue) * 100);
        const inProgressHeight = Math.max(0, height - completedHeight);

        return (
          <div key={point.dateKey} className="progress-chart__column">
            <div className="progress-chart__bar" aria-label={`${total} attempts on ${point.label}`}>
              <div
                className="progress-chart__segment progress-chart__segment--completed"
                style={{ height: `${completedHeight}%` }}
                aria-hidden="true"
              />
              <div
                className="progress-chart__segment progress-chart__segment--in-progress"
                style={{ height: `${inProgressHeight}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="progress-chart__label" aria-hidden="true">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
