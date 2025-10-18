'use client';

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { PracticeMode } from '../../app/practice/constants';
import { Alert } from '../ui/alert';

const MarkdownPreview = dynamic(() => import('./markdown-preview'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        padding: '1rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.9rem'
      }}
    >
      预览加载中...
    </div>
  )
});

export interface PracticeEditorSubmitPayload {
  content: string;
}

export interface PracticeEditorProps {
  prompt: string;
  helperText: string;
  placeholder: string;
  charLimit: number;
  mode: PracticeMode;
  onSubmit: (payload: PracticeEditorSubmitPayload) => Promise<void> | void;
  submittedAt?: string | null;
  defaultValue?: string;
}

type EditorStatus = 'idle' | 'saving' | 'saved' | 'error' | 'limit';

const counterStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '0.75rem',
  fontSize: '0.85rem',
  color: '#4b5563'
};

const helperStyles: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#475569',
  marginBottom: '0.75rem',
  lineHeight: 1.5
};

const buttonPrimaryStyles: React.CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.35rem',
  borderRadius: '999px',
  background: '#4f46e5',
  color: 'white',
  padding: '0.65rem 1.4rem',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.2s ease'
};

const buttonGhostStyles: React.CSSProperties = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.35rem',
  borderRadius: '999px',
  background: 'transparent',
  color: '#4f46e5',
  padding: '0.55rem 1.3rem',
  fontWeight: 600,
  border: '1px solid rgba(99, 102, 241, 0.35)',
  cursor: 'pointer',
  transition: 'background 0.2s ease'
};

const PracticeEditor: React.FC<PracticeEditorProps> = ({
  prompt,
  helperText,
  placeholder,
  charLimit,
  mode,
  onSubmit,
  submittedAt,
  defaultValue
}) => {
  const [value, setValue] = useState(defaultValue ?? '');
  const [status, setStatus] = useState<EditorStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (status !== 'saved' || typeof window === 'undefined') {
      return;
    }
    const timer = window.setTimeout(() => {
      setStatus('idle');
      setStatusMessage('');
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    setValue(defaultValue ?? '');
  }, [defaultValue]);

  const characterCount = value.length;
  const remaining = charLimit - characterCount;

  const showLimitWarning = remaining <= Math.round(charLimit * 0.1) && remaining >= 0;

  const onFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!value.trim()) {
        setStatus('error');
        setStatusMessage('请先输入内容再提交。');
        return;
      }

      if (characterCount > charLimit) {
        setStatus('limit');
        setStatusMessage(`已超过限制 ${charLimit} 字符，请精简后再提交。`);
        return;
      }

      try {
        setStatus('saving');
        setStatusMessage('保存中...');
        await Promise.resolve(onSubmit({ content: value }));
        setStatus('saved');
        setStatusMessage('已保存至本地。');
      } catch (error) {
        console.error('[PracticeEditor] Failed to submit attempt.', error);
        setStatus('error');
        setStatusMessage('保存失败，请稍后再试。');
      }
    },
    [charLimit, characterCount, onSubmit, value]
  );

  const statusAlert = useMemo(() => {
    if (status === 'idle') {
      return null;
    }

    if (status === 'saving') {
      return <Alert variant="info" title="保存中">{statusMessage}</Alert>;
    }

    if (status === 'saved') {
      return <Alert variant="success" title="成功">{statusMessage}</Alert>;
    }

    if (status === 'limit') {
      return <Alert variant="warning" title="超过字数">{statusMessage}</Alert>;
    }

    return <Alert variant="destructive" title="出错了">{statusMessage}</Alert>;
  }, [status, statusMessage]);

  return (
    <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      <section
        style={{
          padding: '1rem 1.25rem',
          border: '1px solid rgba(229, 231, 235, 1)',
          borderRadius: '1rem',
          background: 'white',
          boxShadow: '0 18px 30px -25px rgba(79, 70, 229, 0.35)'
        }}
      >
        <header style={{ marginBottom: '0.75rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: '#7c3aed',
              textTransform: 'uppercase',
              marginBottom: '0.35rem'
            }}
          >
            {mode === 'sentence' ? '句子练习' : '段落练习'}
          </div>
          <p style={{ fontSize: '1rem', color: '#1f2937', lineHeight: 1.6 }}>{prompt}</p>
        </header>
        <p style={helperStyles}>{helperText}</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowPreview((previous) => !previous)}
            style={{
              ...buttonGhostStyles,
              background: showPreview ? 'rgba(99, 102, 241, 0.08)' : buttonGhostStyles.background,
              border: showPreview ? '1px solid rgba(99, 102, 241, 0.6)' : buttonGhostStyles.border,
              color: showPreview ? '#3730a3' : buttonGhostStyles.color
            }}
            aria-pressed={showPreview}
          >
            {showPreview ? '隐藏预览' : '打开预览'}
          </button>
          <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
            {submittedAt ? `最近一次保存：${new Date(submittedAt).toLocaleString()}` : '尚未保存'}
          </span>
        </div>
        {showPreview ? (
          <MarkdownPreview value={value} />
        ) : (
          <textarea
            title="在这里撰写或粘贴你的内容"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              minHeight: '12rem',
              borderRadius: '0.9rem',
              border: '1px solid rgba(209, 213, 219, 1)',
              padding: '1rem',
              fontSize: '1rem',
              lineHeight: 1.7,
              resize: 'vertical',
              outline: 'none',
              boxShadow: 'inset 0 1px 4px rgba(148, 163, 184, 0.18)'
            }}
          />
        )}
        <div style={counterStyles}>
          <span title={`剩余 ${Math.max(0, remaining)} 字符`}>
            字数：{characterCount} / {charLimit}
          </span>
          {showLimitWarning ? (
            <span style={{ color: '#b45309' }}>接近上限，请酌情取舍。</span>
          ) : remaining < 0 ? (
            <span style={{ color: '#dc2626' }}>已超出 {Math.abs(remaining)} 字符</span>
          ) : null}
        </div>
      </section>

      {statusAlert}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="submit"
          style={{
            ...buttonPrimaryStyles,
            opacity: status === 'saving' ? 0.7 : 1
          }}
          disabled={status === 'saving'}
        >
          {status === 'saving' ? '保存中…' : '保存练习'}
        </button>
        <button
          type="button"
          style={buttonGhostStyles}
          onClick={() => setValue('')}
        >
          清空
        </button>
      </div>
    </form>
  );
};

export default PracticeEditor;
