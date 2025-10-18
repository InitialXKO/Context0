'use client';

import * as React from 'react';
import type { ProgressAttempt } from '../progress-context';

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type ProgressHistoryProps = {
  attempts: ProgressAttempt[];
  hydrated: boolean;
};

export function ProgressHistory({ attempts, hydrated }: ProgressHistoryProps) {
  if (!hydrated) {
    return (
      <div className="progress-history__placeholder" aria-live="polite">
        Loading activity…
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="progress-history__empty" role="status" aria-live="polite">
        Your upcoming practice sessions will appear here once you start logging attempts.
      </div>
    );
  }

  return (
    <ol className="progress-history" aria-label="Past practice attempts">
      {attempts.map((attempt) => (
        <li key={attempt.id} className="progress-history__item">
          <details className="progress-history__details">
            <summary className="progress-history__summary">
              <span>
                <strong>{attempt.exerciseTitle}</strong>
                <span className="progress-history__summary-meta">{formatTimestamp(attempt.completedAt)}</span>
              </span>
              <span className={`progress-history__badge progress-history__badge--${attempt.status}`}>
                {attempt.status === 'completed' ? 'Completed' : attempt.status === 'in-progress' ? 'In progress' : 'Aborted'}
              </span>
            </summary>
            <div className="progress-history__panel">
              {attempt.summary && <p className="progress-history__summary-text">{attempt.summary}</p>}

              <dl className="progress-history__meta">
                {typeof attempt.durationMinutes === 'number' && (
                  <div>
                    <dt>Duration</dt>
                    <dd>{attempt.durationMinutes} min</dd>
                  </div>
                )}
                {typeof attempt.score === 'number' && (
                  <div>
                    <dt>Score</dt>
                    <dd>{attempt.score}</dd>
                  </div>
                )}
              </dl>

              {attempt.tools?.length ? (
                <div className="progress-history__tools">
                  <h4>Tools referenced</h4>
                  <ul>
                    {attempt.tools.map((tool, index) => (
                      <li key={`${attempt.id}-tool-${index}`}>
                        {tool.href ? (
                          <a href={tool.href} target="_blank" rel="noreferrer">
                            {tool.name}
                          </a>
                        ) : (
                          <span>{tool.name}</span>
                        )}
                        {tool.description ? <span className="progress-history__tool-description"> — {tool.description}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {attempt.reflections && (
                <div className="progress-history__reflections">
                  <h4>Reflection</h4>
                  <p>{attempt.reflections}</p>
                </div>
              )}
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
