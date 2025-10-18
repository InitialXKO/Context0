'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(component: string): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error(`${component} must be used within a <Dialog /> component.`);
  }
  return context;
}

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const value = React.useMemo<DialogContextValue>(
    () => ({ open, setOpen: onOpenChange }),
    [open, onOpenChange],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children: React.ReactElement }) {
  const { setOpen } = useDialogContext('DialogTrigger');

  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(event);
      if (!event.defaultPrevented) {
        setOpen(true);
      }
    },
  });
}

type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  closeOnAwayClick?: boolean;
};

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, closeOnAwayClick = true, ...props }, ref) => {
    const { open, setOpen } = useDialogContext('DialogContent');

    if (!open) {
      return null;
    }

    return (
      <div className="dialog-overlay">
        <div
          className="dialog-backdrop"
          aria-hidden="true"
          onClick={() => closeOnAwayClick && setOpen(false)}
        />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          className={cn('dialog-panel', className)}
          {...props}
        />
      </div>
    );
  },
);
DialogContent.displayName = 'DialogContent';

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('dialog-header', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('dialog-footer', className)} {...props} />;
}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('dialog-title', className)} {...props} />
  ),
);
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('dialog-description', className)} {...props} />
  ),
);
DialogDescription.displayName = 'DialogDescription';

export function DialogClose({
  children,
  asChild,
}: {
  children: React.ReactElement;
  asChild?: boolean;
}) {
  const { setOpen } = useDialogContext('DialogClose');

  if (asChild) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        children.props.onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      },
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className="dialog-close"
    >
      {children}
    </button>
  );
}
