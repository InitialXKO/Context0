'use client';

import React, { useMemo } from 'react';

export interface MarkdownPreviewProps {
  value: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const basicMarkdown = (value: string): string => {
  const escaped = escapeHtml(value);
  const withStrong = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const withEmphasis = withStrong.replace(/\*(.+?)\*/g, '<em>$1</em>');
  const withInlineCode = withEmphasis.replace(/`([^`]+)`/g, '<code>$1</code>');
  const withParagraphs = withInlineCode
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, '<br />'))
    .map((block) => `<p>${block}</p>`)
    .join('');
  return withParagraphs;
};

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ value }) => {
  const rendered = useMemo(() => basicMarkdown(value || ''), [value]);

  return (
    <div
      style={{
        border: '1px solid rgba(209, 213, 219, 1)',
        borderRadius: '0.75rem',
        background: 'white',
        padding: '1rem',
        lineHeight: 1.7,
        fontSize: '0.95rem',
        color: '#1f2937',
        overflowY: 'auto',
        maxHeight: '24rem'
      }}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
};

export default MarkdownPreview;
