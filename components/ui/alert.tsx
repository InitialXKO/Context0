'use client';

import * as React from 'react';

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';

const variantColours: Record<AlertVariant, { background: string; border: string; color: string }> = {
  default: {
    background: 'rgba(243, 244, 246, 0.7)',
    border: '1px solid rgba(229, 231, 235, 1)',
    color: '#111827'
  },
  info: {
    background: 'rgba(219, 234, 254, 0.6)',
    border: '1px solid rgba(191, 219, 254, 1)',
    color: '#1e3a8a'
  },
  success: {
    background: 'rgba(209, 250, 229, 0.6)',
    border: '1px solid rgba(167, 243, 208, 1)',
    color: '#166534'
  },
  warning: {
    background: 'rgba(254, 243, 199, 0.7)',
    border: '1px solid rgba(253, 224, 71, 1)',
    color: '#92400e'
  },
  destructive: {
    background: 'rgba(254, 226, 226, 0.7)',
    border: '1px solid rgba(252, 165, 165, 1)',
    color: '#991b1b'
  }
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', title, children, style, ...rest }, ref) => {
    const palette = variantColours[variant];
    return (
      <div
        ref={ref}
        role="status"
        style={{
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
          margin: '0.25rem 0',
          background: palette.background,
          border: palette.border,
          color: palette.color,
          lineHeight: 1.5,
          fontSize: '0.95rem',
          ...style
        }}
        data-variant={variant}
        {...rest}
      >
        {title ? (
          <div style={{ fontWeight: 600, marginBottom: children ? '0.25rem' : 0 }}>{title}</div>
        ) : null}
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
