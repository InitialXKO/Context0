"use client";

import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProgressContext } from "@/components/providers/ProgressProvider";
import { cn } from "@/lib/utils";

type ChecklistPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChecklistPanel({ open, onOpenChange }: ChecklistPanelProps) {
  const { sections, progress, toggleItem, reset, completed, total, percentage, hydrated } = useProgressContext();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" aria-labelledby="checklist-panel-title">
        <SheetHeader className="sheet-header">
          <SheetTitle id="checklist-panel-title" className="sheet-title">
            Exam checklist
          </SheetTitle>
          <SheetDescription className="sheet-description">
            Track progress across critical exam milestones. Your completion state automatically persists between
            sessions on this device.
          </SheetDescription>
        </SheetHeader>

        <div className="sheet-progress-pill" aria-live="polite">
          <span>{completed} of {total} complete</span>
          <span aria-hidden>•</span>
          <span>{percentage}%</span>
        </div>

        <div className="sheet-body" role="list" aria-label="Exam preparation checklist">
          {sections.map((section) => (
            <section className="sheet-section" key={section.id} role="listitem">
              <div>
                <h3>{section.title}</h3>
                {section.hint ? <p>{section.hint}</p> : null}
              </div>
              <div>
                {section.items.map((item) => {
                  const checked = progress[item.id];
                  return (
                    <div className={cn("checklist-item", checked && "checklist-item--checked")} key={item.id}>
                      <input
                        id={`checklist-${item.id}`}
                        type="checkbox"
                        checked={Boolean(checked)}
                        disabled={!hydrated}
                        onChange={() => toggleItem(item.id)}
                        aria-checked={Boolean(checked)}
                      />
                      <label htmlFor={`checklist-${item.id}`}>{item.label}</label>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <SheetFooter className="checklist-footer">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close checklist"
            className="button-reset"
            style={{
              color: "var(--color-muted)",
              display: "inline-flex",
              alignItems: "center"
            }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!hydrated || completed === 0}
            style={{
              background: "rgba(37, 99, 235, 0.12)",
              color: "rgba(29, 78, 216, 1)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              opacity: !hydrated || completed === 0 ? 0.65 : 1,
              cursor: !hydrated || completed === 0 ? "not-allowed" : "pointer"
            }}
          >
            Reset progress
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ChecklistPanel;
