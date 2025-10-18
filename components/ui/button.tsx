'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

type ButtonProps = {
  variant?: Variant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<Variant, string> = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  ghost: 'btn--ghost',
  destructive: 'btn--destructive',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn('btn', variantClasses[variant], className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
