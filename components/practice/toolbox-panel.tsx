'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { ToolHint } from '../../app/practice/constants';
import { Alert } from '../ui/alert';

export interface ToolboxPanelProps {
  tools: ToolHint[];
  selectedTools: string[];
  onToolToggle: (toolId: string) => void;
  title?: string;
}

const containerStyle: React.CSSProperties = {
  border: '1px solid rgba(229, 231, 235, 1)',
  borderRadius: '1rem',
  padding: '1rem',
  background: 'rgba(249, 250, 251, 0.9)',
  boxShadow: '0 8px 24px -16px rgba(15, 23, 42, 0.25)',
  height: '100%',
  overflowY: 'auto'
};

const ToolboxPanel: React.FC<ToolboxPanelProps> = ({ tools, selectedTools, onToolToggle, title }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia('(max-width: 900px)');
    const update = () => setIsMobile(media.matches);

    try {
      update();
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
      }

      if (typeof media.addListener === 'function') {
        media.addListener(update);
        return () => media.removeListener(update);
      }
    } catch {
      // ignore mismatch when matchMedia is unsupported
      update();
    }

    return () => undefined;
  }, []);

  const content = useMemo(
    () => (
      <div>
        <header style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: '#4338ca', textTransform: 'uppercase' }}>
            工具提示
          </div>
          <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', fontWeight: 600 }}>{title ?? '练习工具箱'}</h3>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tools.map((tool) => {
            const checked = selectedTools.includes(tool.id);
            return (
              <section
                key={tool.id}
                style={{
                  border: '1px solid rgba(209, 213, 219, 1)',
                  borderRadius: '0.9rem',
                  padding: '0.75rem 0.9rem',
                  background: checked ? 'rgba(219, 234, 254, 0.5)' : 'white',
                  transition: 'background 0.2s ease, border 0.2s ease'
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToolToggle(tool.id)}
                    style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                    aria-label={`标记工具 ${tool.name} 已使用`}
                  />
                  <span>{tool.name}</span>
                </label>
                <dl style={{ fontSize: '0.85rem', margin: '0.5rem 0 0', lineHeight: 1.55 }}>
                  <dt style={{ fontWeight: 500, color: '#2563eb' }}>记忆口诀</dt>
                  <dd style={{ margin: '0.15rem 0 0.45rem', color: '#1f2937' }}>{tool.mnemonic}</dd>
                  <dt style={{ fontWeight: 500, color: '#2563eb' }}>使用技巧</dt>
                  <dd style={{ margin: '0.15rem 0 0.45rem', color: '#1f2937' }}>{tool.description}</dd>
                  <dt style={{ fontWeight: 500, color: '#2563eb' }}>示例</dt>
                  <dd style={{ margin: '0.15rem 0 0', color: '#4b5563' }}>{tool.example}</dd>
                </dl>
              </section>
            );
          })}
        </div>
        <Alert
          variant="info"
          title="提示"
          style={{ marginTop: '1rem', fontSize: '0.85rem' }}
        >
          勾选的工具会记录在提交历史中，方便回顾自己的练习路径。
        </Alert>
      </div>
    ),
    [onToolToggle, selectedTools, title, tools]
  );

  if (isMobile) {
    return (
      <details open style={{ width: '100%', marginTop: '1.25rem' }}>
        <summary
          style={{
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            listStyle: 'none',
            marginBottom: '0.75rem'
          }}
        >
          工具提示
        </summary>
        <div style={containerStyle}>{content}</div>
      </details>
    );
  }

  return (
    <aside style={containerStyle} aria-label="练习工具箱">
      {content}
    </aside>
  );
};

export default ToolboxPanel;
