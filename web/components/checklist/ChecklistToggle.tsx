"use client";

import React from "react";
import dynamic from "next/dynamic";
import { CheckCheck } from "lucide-react";
import { useProgressContext } from "@/components/providers/ProgressProvider";

const ChecklistPanel = dynamic(() => import("@/components/checklist/ChecklistPanel"), {
  ssr: false
});

export function ChecklistToggle() {
  const [open, setOpen] = React.useState(false);
  const { completed, total, percentage } = useProgressContext();

  const label = `${completed} of ${total} tasks complete (${percentage}%)`;

  return (
    <>
      <ChecklistPanel open={open} onOpenChange={setOpen} />
      <button
        type="button"
        className="floating-toggle"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Open checklist panel. ${label}`}
        onClick={() => setOpen(true)}
      >
        <CheckCheck aria-hidden width={20} height={20} />
        <span>Checklist</span>
        <span aria-hidden>{completed}/{total}</span>
      </button>
    </>
  );
}

export default ChecklistToggle;
