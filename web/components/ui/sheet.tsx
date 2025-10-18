"use client";

import React from "react";
import { cn, mergeRefs } from "@/lib/utils";

type SheetContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

type SheetProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export function Sheet({ open: controlledOpen, defaultOpen, onOpenChange, children }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange]
  );

  const context = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <SheetContext.Provider value={context}>{children}</SheetContext.Provider>;
}

export const SheetTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  function SheetTrigger({ onClick, ...props }, ref) {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error("SheetTrigger must be used within a Sheet");

    return (
      <button
        type="button"
        {...props}
        ref={ref}
        onClick={(event) => {
          onClick?.(event);
          context.setOpen(!context.open);
        }}
      />
    );
  }
);

export const SheetClose = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  function SheetClose({ onClick, ...props }, ref) {
    const context = React.useContext(SheetContext);
    if (!context) throw new Error("SheetClose must be used within a Sheet");

    return (
      <button
        type="button"
        {...props}
        ref={ref}
        onClick={(event) => {
          onClick?.(event);
          context.setOpen(false);
        }}
      />
    );
  }
);

type SheetContentProps = React.ComponentPropsWithoutRef<"div"> & {
  side?: "left" | "right" | "top" | "bottom";
};

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { className, children, side = "right", ...props },
  ref
) {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used within a Sheet");

  const { open, setOpen } = context;
  const localRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, setOpen]);

  React.useEffect(() => {
    if (open && localRef.current) {
      localRef.current.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div role="dialog" aria-modal className="sheet-portal">
      <div className="sheet-overlay" onClick={() => setOpen(false)} aria-hidden />
      <div
        ref={mergeRefs(ref, localRef)}
        tabIndex={-1}
        className={cn("sheet-content", className, sideClassName(side))}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

function sideClassName(side: SheetContentProps["side"]) {
  switch (side) {
    case "left":
      return "sheet-left";
    case "top":
      return "sheet-top";
    case "bottom":
      return "sheet-bottom";
    default:
      return "sheet-right";
  }
}

export function SheetHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("sheet-header", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("sheet-footer", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: React.ComponentPropsWithoutRef<"h2">) {
  return <h2 className={cn("sheet-title", className)} {...props} />;
}

export function SheetDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
  return <p className={cn("sheet-description", className)} {...props} />;
}
