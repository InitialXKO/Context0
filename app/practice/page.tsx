'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  PRACTICE_SECTIONS,
  PracticeMode,
  PracticePrompt,
  TOOL_HINTS
} from './constants';
import { ProgressProvider, useProgress } from '../../components/practice/progress-context';
import ToolboxPanel from '../../components/practice/toolbox-panel';
import type { PracticeEditorSubmitPayload } from '../../components/practice/practice-editor';

const PracticeEditor = dynamic(() => import('../../components/practice/practice-editor'), {
  ssr: false,
  loading: () => <div style={{ padding: '2rem', textAlign: 'center' }}>编辑器加载中…</div>
});

const modeButtonBase: React.CSSProperties = {
  borderRadius: '999px',
  padding: '0.55rem 1.35rem',
  fontWeight: 600,
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: 'rgba(248, 250, 252, 0.9)',
  color: '#334155'
};

const PracticePageContainer: React.FC = () => {
  const [mode, setMode] = useState<PracticeMode>('sentence');
  const [selectedPromptId, setSelectedPromptId] = useState<string>(
    PRACTICE_SECTIONS.sentence.prompts[0]?.id ?? ''
  );
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>(
    PRACTICE_SECTIONS.sentence.prompts[0]?.toolIds ?? []
  );

  const { attempts, saveAttempt } = useProgress();

  const section = PRACTICE_SECTIONS[mode];

  const selectedPrompt: PracticePrompt | undefined = useMemo(
    () => section.prompts.find((prompt) => prompt.id === selectedPromptId) ?? section.prompts[0],
    [section.prompts, selectedPromptId]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia('(max-width: 960px)');
    const update = () => setIsMobile(media.matches);

    try {
      update();
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
      }

      media.addListener(update);
      return () => media.removeListener(update);
    } catch {
      update();
      return () => undefined;
    }
  }, []);

  useEffect(() => {
    const promptIds = new Set(section.prompts.map((prompt) => prompt.id));
    if (!promptIds.has(selectedPromptId)) {
      const fallback = section.prompts[0]?.id;
      if (fallback) {
        setSelectedPromptId(fallback);
      }
    }
  }, [section.prompts, selectedPromptId]);

  useEffect(() => {
    if (!selectedPrompt) {
      setSelectedTools([]);
      return;
    }
    setSelectedTools(selectedPrompt.toolIds);
  }, [mode, selectedPromptId, selectedPrompt]);

  const attemptsForPrompt = useMemo(
    () =>
      selectedPrompt ? attempts.filter((attempt) => attempt.promptId === selectedPrompt.id) : [],
    [attempts, selectedPrompt]
  );

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const latest = attemptsForPrompt[attemptsForPrompt.length - 1];
    setLastSavedAt(latest?.createdAt ?? null);
  }, [attemptsForPrompt]);

  const handleToolToggle = useCallback(
    (toolId: string) => {
      setSelectedTools((prev) => {
        if (prev.includes(toolId)) {
          return prev.filter((id) => id !== toolId);
        }
        return [...prev, toolId];
      });
    },
    []
  );

  const handleModeChange = useCallback((nextMode: PracticeMode) => {
    setMode(nextMode);
    const defaultPrompt = PRACTICE_SECTIONS[nextMode].prompts[0];
    if (defaultPrompt) {
      setSelectedPromptId(defaultPrompt.id);
      setSelectedTools(defaultPrompt.toolIds);
    }
  }, []);

  const handleSubmit = useCallback(
    async ({ content }: PracticeEditorSubmitPayload) => {
      if (!selectedPrompt) {
        return;
      }
      const attempt = saveAttempt({
        mode,
        promptId: selectedPrompt.id,
        response: content,
        tools: selectedTools
      });
      setLastSavedAt(attempt.createdAt);
    },
    [mode, saveAttempt, selectedPrompt, selectedTools]
  );

  const relevantTools = useMemo(
    () =>
      (selectedPrompt?.toolIds ?? [])
        .map((id) => TOOL_HINTS[id])
        .filter((hint): hint is NonNullable<typeof hint> => Boolean(hint)),
    [selectedPrompt]
  );

  const layoutStyle: React.CSSProperties = isMobile
    ? {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }
    : {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 7fr) minmax(18rem, 3fr)',
        gap: '1.75rem',
        alignItems: 'start'
      };

  return (
    <div style={{ padding: '1.75rem 1.5rem', maxWidth: '1120px', margin: '0 auto' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>写作练习区</h1>
        <p style={{ marginTop: '0.5rem', color: '#4b5563', lineHeight: 1.6 }}>
          从预设练习中选择一个场景，利用工具箱提示和进度追踪逐步提升写作质量。
        </p>
      </header>

      <section style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {(Object.keys(PRACTICE_SECTIONS) as PracticeMode[]).map((key) => {
          const definition = PRACTICE_SECTIONS[key];
          const active = key === mode;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleModeChange(key)}
              style={{
                ...modeButtonBase,
                background: active ? '#4f46e5' : modeButtonBase.background,
                color: active ? 'white' : modeButtonBase.color,
                borderColor: active ? '#4338ca' : 'rgba(203, 213, 225, 0.8)'
              }}
              aria-pressed={active}
            >
              {definition.title}
            </button>
          );
        })}
      </section>

      <section style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{section.title}</h2>
        <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: 1.6 }}>{section.description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {section.prompts.map((prompt) => {
            const active = prompt.id === selectedPrompt?.id;
            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => setSelectedPromptId(prompt.id)}
                style={{
                  textAlign: 'left',
                  borderRadius: '1rem',
                  border: active
                    ? '1px solid rgba(99, 102, 241, 0.85)'
                    : '1px solid rgba(226, 232, 240, 1)',
                  background: active ? 'rgba(79, 70, 229, 0.08)' : 'rgba(248, 250, 252, 0.75)',
                  padding: '1rem 1.1rem',
                  cursor: 'pointer',
                  boxShadow: active
                    ? '0 12px 30px -18px rgba(99, 102, 241, 0.55)'
                    : '0 10px 18px -18px rgba(148, 163, 184, 0.55)'
                }}
                aria-pressed={active}
              >
                <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                  {prompt.label}
                </div>
                <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>{prompt.summary}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div style={layoutStyle}>
        <div style={{ minWidth: 0 }}>
          {selectedPrompt ? (
            <PracticeEditor
              prompt={selectedPrompt.systemPrompt}
              helperText={selectedPrompt.helperText}
              placeholder={selectedPrompt.placeholder}
              charLimit={selectedPrompt.charLimit ?? section.defaultCharLimit}
              mode={mode}
              submittedAt={lastSavedAt}
              defaultValue={
                attemptsForPrompt[attemptsForPrompt.length - 1]?.response ?? ''
              }
              onSubmit={handleSubmit}
            />
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '1rem', border: '1px dashed #cbd5f5' }}>
              尚未选择练习提示。
            </div>
          )}

          <section style={{ marginTop: '1.75rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>练习历史</h3>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {attemptsForPrompt.length} 次尝试
              </span>
            </header>
            {attemptsForPrompt.length === 0 ? (
              <p style={{ marginTop: '0.75rem', color: '#64748b' }}>
                练习将自动保存到本地浏览器，提交后会显示在此处。
              </p>
            ) : (
              <ol style={{ margin: '0.75rem 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {attemptsForPrompt
                  .slice()
                  .reverse()
                  .map((attempt) => (
                    <li
                      key={attempt.id}
                      style={{
                        border: '1px solid rgba(226, 232, 240, 1)',
                        borderRadius: '0.9rem',
                        padding: '0.85rem 1rem',
                        background: 'white'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 500, color: '#1e293b' }}>
                          {new Date(attempt.createdAt).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {attempt.characters} 字符 · {attempt.words} 词 · 使用 {attempt.tools.length} 项工具
                        </span>
                      </div>
                      {attempt.tools.length > 0 ? (
                        <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#4338ca' }}>
                          工具：{attempt.tools.map((toolId) => TOOL_HINTS[toolId]?.name ?? toolId).join('、')}
                        </div>
                      ) : null}
                    </li>
                  ))}
              </ol>
            )}
          </section>
        </div>

        <ToolboxPanel
          tools={relevantTools}
          selectedTools={selectedTools}
          onToolToggle={handleToolToggle}
          title={selectedPrompt?.label}
        />
      </div>
    </div>
  );
};

const PracticePage: React.FC = () => (
  <ProgressProvider>
    <PracticePageContainer />
  </ProgressProvider>
);

export default PracticePage;
