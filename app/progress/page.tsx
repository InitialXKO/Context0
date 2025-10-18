'use client';

import * as React from 'react';
import { ProgressProvider, useProgress } from './progress-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../components/ui/dialog';
import { ProgressChart } from './_components/progress-chart';
import { ProgressHistory } from './_components/progress-history';

function ProgressDashboard() {
  const { attempts, metrics, hydrated, clearProgress } = useProgress();
  const [modalOpen, setModalOpen] = React.useState(false);

  const recentActivityLabel = React.useMemo(() => {
    if (!metrics.recentActivity) {
      return 'No activity captured yet.';
    }
    const date = new Date(metrics.recentActivity.completedAt);
    const formatted = Number.isNaN(date.getTime())
      ? 'Unknown date'
      : date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    return `Latest: ${metrics.recentActivity.exerciseTitle} — ${formatted}`;
  }, [metrics.recentActivity]);

  const isEmpty = hydrated && attempts.length === 0;

  return (
    <div className="progress-page">
      <header className="progress-page__header">
        <div>
          <h1>My Learning Progress</h1>
          <p>Visualize what you have completed, when you practiced, and what tools supported you.</p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger>
            <Button variant="destructive" disabled={attempts.length === 0}>
              Clear data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset your progress?</DialogTitle>
              <DialogDescription>
                This removes all locally stored attempts and cannot be undone. You will keep any synced history
                stored elsewhere.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  clearProgress();
                  setModalOpen(false);
                }}
              >
                Yes, clear everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <section className="progress-page__metrics" aria-label="Key progress metrics">
        <Card>
          <CardHeader>
            <CardTitle>Completed exercises</CardTitle>
            <CardDescription>Total finished practice sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="progress-metric__value">{hydrated ? metrics.completedExercises : '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distinct learning days</CardTitle>
            <CardDescription>Unique days with recorded activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="progress-metric__value">{hydrated ? metrics.distinctLearningDays : '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Snapshot of the latest attempt.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="progress-metric__value progress-metric__value--smaller">{hydrated ? recentActivityLabel : '—'}</p>
          </CardContent>
        </Card>
      </section>

      <section className="progress-page__chart" aria-label="Completion chart">
        <Card>
          <CardHeader>
            <CardTitle>Completion trend</CardTitle>
            <CardDescription>Comparing completed and in-progress attempts for recent days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChart attempts={attempts} hydrated={hydrated} />
          </CardContent>
        </Card>
      </section>

      <section className="progress-page__history" aria-label="Past attempts">
        <Card>
          <CardHeader>
            <CardTitle>Attempt history</CardTitle>
            <CardDescription>
              {isEmpty
                ? 'You have not recorded any attempts yet. Once you start practicing, the full history appears here.'
                : 'Expand an entry to revisit notes, duration, and referenced tools.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressHistory attempts={attempts} hydrated={hydrated} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <ProgressProvider>
      <ProgressDashboard />
    </ProgressProvider>
  );
}
