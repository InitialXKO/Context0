'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSwappingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CTA_CONTENT,
  MATERIAL_CLUSTERS,
  OUTLINE_SEGMENTS,
  PRACTICE_SUGGESTIONS,
  SPEED_STEPS,
  STATEMENT_FIELDS,
  STATEMENT_PREVIEW_TEMPLATE,
  STEP_TIPS,
  type GuidanceTip,
  type MaterialCluster,
  type MaterialNode,
  type OutlineSegment,
  type SpeedStepId,
  type SpeedStepMeta
} from './constants';

type StatementState = Record<string, string>;

type OutlineNotes = Record<string, string>;

type DragIdentifier = string;

const STEP_ORDER = SPEED_STEPS.map((step) => step.id);

const createEmptyStatement = (): StatementState => {
  const next: StatementState = {};
  for (const field of STATEMENT_FIELDS) {
    next[field.id] = '';
  }
  return next;
};

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return true;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch (error) {
      console.warn('Failed to parse local storage value for', key, error);
    }
    return initialValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to persist value for', key, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

interface SortableCardProps {
  id: DragIdentifier;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

function SortableCard({ id, children, className, ariaLabel }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isOver, isDragging } = useSortable({ id });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    touchAction: 'none',
    userSelect: 'none',
    zIndex: isDragging ? 5 : undefined,
    outline: isOver ? '2px solid rgba(96, 165, 250, 0.6)' : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      aria-roledescription="draggable"
      aria-label={ariaLabel}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

const pageStyles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #0f172a, #020617 60%)',
    color: 'rgba(226,232,240,0.96)',
    padding: '48px 16px'
  },
  shell: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  timeline: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  timelineButton: {
    width: '100%',
    borderRadius: '16px',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    padding: '16px',
    background: 'rgba(15, 23, 42, 0.4)',
    color: 'inherit',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'transform 160ms ease, border 160ms ease, background 160ms ease',
    cursor: 'pointer'
  },
  progressTrack: {
    position: 'relative',
    height: '10px',
    borderRadius: '12px',
    background: 'rgba(71, 85, 105, 0.3)',
    overflow: 'hidden'
  },
  layout: {
    display: 'grid',
    gap: '24px',
    alignItems: 'start'
  },
  sidebar: {
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: '20px',
    padding: '24px',
    position: 'sticky',
    top: '24px'
  },
  card: {
    background: 'rgba(15, 23, 42, 0.55)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: '18px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }
};

const mobileBreakpoint = 1024;

export default function SpeedMethodPage() {
  const [activeStep, setActiveStep] = usePersistentState<SpeedStepId>('speed-method/active-step', STEP_ORDER[0]);
  const [selectedPromptId, setSelectedPromptId] = usePersistentState<string | null>('speed-method/prompt', null);
  const [statementState, setStatementState] = usePersistentState<StatementState>(
    'speed-method/statement',
    createEmptyStatement()
  );
  const [statementTouched, setStatementTouched] = useState(false);

  const [selectedMaterials, setSelectedMaterials] = usePersistentState<string[]>(
    'speed-method/materials',
    []
  );

  const [outlineOrder, setOutlineOrder] = usePersistentState<string[]>(
    'speed-method/outline-order',
    OUTLINE_SEGMENTS.map((segment) => segment.id)
  );

  const [outlineNotes, setOutlineNotes] = usePersistentState<OutlineNotes>('speed-method/outline-notes', {});

  const [expandedClusters, setExpandedClusters] = useState<string[]>(() => MATERIAL_CLUSTERS.map((cluster) => cluster.id));
  const [hasMotionPreference, setHasMotionPreference] = useState(prefersReducedMotion);

  useEffect(() => {
    const handler = () => setHasMotionPreference(prefersReducedMotion());
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      handler();
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
    return undefined;
  }, []);

  const stepById = useMemo(() => {
    return new Map<SpeedStepId, SpeedStepMeta>(SPEED_STEPS.map((step) => [step.id, step]));
  }, []);

  const materialNodeById = useMemo(() => {
    const map = new Map<string, MaterialNode & { clusterId: string }>();
    for (const cluster of MATERIAL_CLUSTERS) {
      for (const node of cluster.nodes) {
        map.set(node.id, { ...node, clusterId: cluster.id });
      }
    }
    return map;
  }, []);

  const outlineSegmentById = useMemo(() => {
    const map = new Map<string, OutlineSegment>();
    for (const segment of OUTLINE_SEGMENTS) {
      map.set(segment.id, segment);
    }
    return map;
  }, []);

  const selectedPrompt = useMemo(() => {
    const understandStep = stepById.get('understand');
    if (!understandStep?.prompts) return null;
    return understandStep.prompts.find((prompt) => prompt.id === selectedPromptId) ?? null;
  }, [selectedPromptId, stepById]);

  const statementIsComplete = useMemo(
    () => STATEMENT_FIELDS.every((field) => (statementState[field.id] ?? '').trim().length > 0),
    [statementState]
  );

  const materialsComplete = selectedMaterials.length >= 3;

  const outlineChangedOrder =
    outlineOrder.length === OUTLINE_SEGMENTS.length &&
    outlineOrder.some((id, index) => OUTLINE_SEGMENTS[index]?.id !== id);

  const outlineHasNotes = Object.values(outlineNotes).some((entry) => entry?.trim().length);

  const outlineComplete = outlineChangedOrder || outlineHasNotes;

  const stepCompletion: Record<SpeedStepId, boolean> = {
    understand: Boolean(selectedPromptId),
    angle: statementIsComplete,
    material: materialsComplete,
    outline: outlineComplete
  };

  const completedCount = STEP_ORDER.reduce((count, stepId) => count + (stepCompletion[stepId] ? 1 : 0), 0);
  const progressValue = Math.round((completedCount / STEP_ORDER.length) * 100);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      if (window.innerWidth < mobileBreakpoint) {
        setExpandedClusters((prev) => prev.length ? prev : MATERIAL_CLUSTERS.map((cluster) => cluster.id));
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const buildStatementPreview = () => {
    let preview = STATEMENT_PREVIEW_TEMPLATE;
    for (const field of STATEMENT_FIELDS) {
      const value = (statementState[field.id] ?? '').trim() || '______';
      preview = preview.replace(`{{${field.id}}}`, value);
    }
    return preview;
  };

  const toggleClusterExpansion = (clusterId: string) => {
    setExpandedClusters((prev) =>
      prev.includes(clusterId) ? prev.filter((id) => id !== clusterId) : [...prev, clusterId]
    );
  };

  const toggleMaterialSelection = (materialId: string) => {
    setSelectedMaterials((prev) => {
      if (prev.includes(materialId)) {
        return prev.filter((id) => id !== materialId);
      }
      return [...prev, materialId];
    });
  };

  const handleMaterialDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSelectedMaterials((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleOutlineDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOutlineOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleStatementChange = (fieldId: string, value: string) => {
    setStatementState((prev) => ({ ...prev, [fieldId]: value }));
  };

  const activeTips: GuidanceTip[] = STEP_TIPS[activeStep] ?? [];
  const currentStepMeta = stepById.get(activeStep);

  return (
    <div style={pageStyles.container}>
      <main style={pageStyles.shell}>
        <header style={pageStyles.header}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.24em', fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.7)' }}>
              速成法 Speed Method
            </span>
            <h1 style={{ fontSize: '2.6rem', lineHeight: 1.1, fontWeight: 700 }}>
              四步十分钟，搭建高分作文的快速骨架
            </h1>
            <p style={{ maxWidth: '720px', color: 'rgba(203, 213, 225, 0.85)', fontSize: '1.05rem' }}>
              按照时间轴推进：先准确审题，再写出中心句、挑选素材、拖拽生成段落提纲。
              途中产生的选择会自动保存在浏览器中，下次打开即可继续。
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.95rem', color: 'rgba(148, 163, 184, 0.8)' }}>整体进度</span>
              <span style={{ fontWeight: 600 }}>{progressValue}% 完成</span>
            </div>
            <div style={pageStyles.progressTrack} aria-hidden>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: `${progressValue}%`,
                  background: 'linear-gradient(90deg, #38bdf8, #8b5cf6)',
                  transition: hasMotionPreference ? undefined : 'width 360ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>

          <ol style={pageStyles.timeline}>
            {SPEED_STEPS.map((step) => {
              const status = step.id === activeStep ? 'current' : stepCompletion[step.id] ? 'done' : 'todo';
              const background =
                status === 'current'
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(139, 92, 246, 0.25))'
                  : status === 'done'
                    ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.18), rgba(16, 185, 129, 0.22))'
                    : 'rgba(15, 23, 42, 0.4)';
              const borderColor = status === 'todo' ? 'rgba(148, 163, 184, 0.22)' : 'rgba(148, 163, 184, 0.38)';

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    style={{
                      ...pageStyles.timelineButton,
                      background,
                      borderColor,
                      transform: step.id === activeStep ? 'translateY(-2px)' : undefined,
                      boxShadow:
                        step.id === activeStep
                          ? '0 18px 40px rgba(56, 189, 248, 0.15)'
                          : stepCompletion[step.id]
                            ? '0 12px 26px rgba(34, 197, 94, 0.12)'
                            : undefined
                    }}
                    aria-pressed={step.id === activeStep}
                    aria-current={step.id === activeStep ? 'step' : undefined}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{step.title}</span>
                    <span style={{ fontSize: '0.9rem', color: 'rgba(148, 163, 184, 0.85)' }}>{step.timebox}</span>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(203, 213, 225, 0.78)' }}>{step.summary}</p>
                  </button>
                </li>
              );
            })}
          </ol>
        </header>

        <section
          style={{
            ...pageStyles.layout,
            gridTemplateColumns: 'minmax(0, 1fr)',
            gap: '28px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {currentStepMeta ? (
              <StepPanel
                key={currentStepMeta.id}
                step={currentStepMeta}
                status={stepCompletion[currentStepMeta.id] ? 'complete' : 'in-progress'}
                selectedPromptId={selectedPromptId}
                onPromptSelect={setSelectedPromptId}
                onStatementChange={handleStatementChange}
                statementState={statementState}
                statementTouched={statementTouched}
                setStatementTouched={setStatementTouched}
                statementPreview={buildStatementPreview()}
                onToggleMaterial={toggleMaterialSelection}
                selectedMaterialIds={selectedMaterials}
                expandedClusters={expandedClusters}
                onToggleCluster={toggleClusterExpansion}
                clusters={MATERIAL_CLUSTERS}
                materialLookup={materialNodeById}
                onMaterialDragEnd={handleMaterialDragEnd}
                outlineOrder={outlineOrder}
                outlineLookup={outlineSegmentById}
                onOutlineDragEnd={handleOutlineDragEnd}
                onOutlineNoteChange={(segmentId, value) =>
                  setOutlineNotes((prev) => ({ ...prev, [segmentId]: value }))
                }
                outlineNotes={outlineNotes}
                hasMotionPreference={hasMotionPreference}
              />
            ) : null}
          </div>

          <aside style={pageStyles.sidebar} aria-label="引导提示">
            <SidebarContent
              activeStep={activeStep}
              tips={activeTips}
              selectedPrompt={selectedPrompt?.headline}
              statementComplete={statementIsComplete}
              materialsCount={selectedMaterials.length}
              outlineDone={outlineComplete}
            />
          </aside>
        </section>
      </main>
    </div>
  );
}

interface StepPanelProps {
  step: SpeedStepMeta;
  status: 'in-progress' | 'complete';
  selectedPromptId: string | null;
  onPromptSelect: (promptId: string) => void;
  onStatementChange: (fieldId: string, value: string) => void;
  statementState: StatementState;
  statementTouched: boolean;
  setStatementTouched: (value: boolean) => void;
  statementPreview: string;
  onToggleMaterial: (materialId: string) => void;
  selectedMaterialIds: string[];
  expandedClusters: string[];
  onToggleCluster: (clusterId: string) => void;
  clusters: MaterialCluster[];
  materialLookup: Map<string, MaterialNode & { clusterId: string }>;
  onMaterialDragEnd: (event: DragEndEvent) => void;
  outlineOrder: string[];
  outlineLookup: Map<string, OutlineSegment>;
  onOutlineDragEnd: (event: DragEndEvent) => void;
  onOutlineNoteChange: (segmentId: string, value: string) => void;
  outlineNotes: OutlineNotes;
  hasMotionPreference: boolean;
}

function StepPanel({
  step,
  status,
  selectedPromptId,
  onPromptSelect,
  onStatementChange,
  statementState,
  statementTouched,
  setStatementTouched,
  statementPreview,
  onToggleMaterial,
  selectedMaterialIds,
  expandedClusters,
  onToggleCluster,
  clusters,
  materialLookup,
  onMaterialDragEnd,
  outlineOrder,
  outlineLookup,
  onOutlineDragEnd,
  onOutlineNoteChange,
  outlineNotes,
  hasMotionPreference
}: StepPanelProps) {
  return (
    <div style={pageStyles.card}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: status === 'complete' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(56, 189, 248, 0.12)',
              color: status === 'complete' ? 'rgba(134, 239, 172, 0.9)' : 'rgba(125, 211, 252, 0.9)'
            }}
          >
            {status === 'complete' ? '完成 ✔' : '专注中'}
          </span>
          <span style={{ color: 'rgba(148, 163, 184, 0.66)' }}>{step.timebox}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 600 }}>{step.title}</h2>
          <p style={{ color: 'rgba(203, 213, 225, 0.78)' }}>{step.summary}</p>
        </div>
        <GoalsList goals={step.goals} />
      </header>

      {step.id === 'understand' && step.prompts ? (
        <PromptSelector
          prompts={step.prompts}
          selectedPromptId={selectedPromptId}
          onSelect={onPromptSelect}
        />
      ) : null}

      {step.id === 'angle' ? (
        <StatementBuilder
          onChange={onStatementChange}
          state={statementState}
          touched={statementTouched}
          setTouched={setStatementTouched}
          preview={statementPreview}
          hasMotionPreference={hasMotionPreference}
        />
      ) : null}

      {step.id === 'material' ? (
        <MaterialPicker
          clusters={clusters}
          materialLookup={materialLookup}
          expandedClusters={expandedClusters}
          onToggleCluster={onToggleCluster}
          onToggleMaterial={onToggleMaterial}
          selectedMaterialIds={selectedMaterialIds}
          onDragEnd={onMaterialDragEnd}
        />
      ) : null}

      {step.id === 'outline' ? (
        <OutlineBuilder
          order={outlineOrder}
          lookup={outlineLookup}
          onDragEnd={onOutlineDragEnd}
          onOutlineNoteChange={onOutlineNoteChange}
          outlineNotes={outlineNotes}
          selectedMaterialIds={selectedMaterialIds}
          materialLookup={materialLookup}
        />
      ) : null}
    </div>
  );
}

function GoalsList({ goals }: { goals: string[] }) {
  return (
    <ul
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}
    >
      {goals.map((goal) => (
        <li
          key={goal}
          style={{
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'rgba(148, 163, 184, 0.12)',
            color: 'rgba(203, 213, 225, 0.86)',
            fontSize: '0.85rem'
          }}
        >
          {goal}
        </li>
      ))}
    </ul>
  );
}

interface PromptSelectorProps {
  prompts: SpeedStepMeta['prompts'];
  selectedPromptId: string | null;
  onSelect: (promptId: string) => void;
}

function PromptSelector({ prompts = [], selectedPromptId, onSelect }: PromptSelectorProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>选择一个审题提示</h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '0.95rem' }}>
          把题干翻译成一句你能理解的话。选择下方提示可以帮助你精准聚焦。
        </p>
      </header>
      <div
        role="list"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}
      >
        {prompts.map((prompt) => {
          const isSelected = selectedPromptId === prompt.id;
          return (
            <button
              key={prompt.id}
              type="button"
              role="listitem"
              onClick={() => onSelect(prompt.id)}
              style={{
                textAlign: 'left',
                borderRadius: '16px',
                border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.8)' : 'rgba(148, 163, 184, 0.28)'}`,
                padding: '18px',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(139, 92, 246, 0.22))'
                  : 'rgba(15, 23, 42, 0.45)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '0.95rem',
                color: 'inherit',
                transition: 'transform 180ms ease, border 180ms ease'
              }}
              aria-pressed={isSelected}
            >
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{prompt.headline}</h4>
                <p style={{ color: 'rgba(203, 213, 225, 0.78)', marginTop: '6px' }}>{prompt.helper}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'rgba(148, 163, 184, 0.7)' }}>
                  示例
                </span>
                <p style={{ color: 'rgba(148, 163, 184, 0.9)', marginTop: '4px' }}>{prompt.example}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {prompt.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    style={{
                      fontSize: '0.8rem',
                      padding: '4px 8px',
                      borderRadius: '999px',
                      background: 'rgba(148, 163, 184, 0.15)',
                      color: 'rgba(148, 163, 184, 0.88)'
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface StatementBuilderProps {
  state: StatementState;
  onChange: (fieldId: string, value: string) => void;
  touched: boolean;
  setTouched: (state: boolean) => void;
  preview: string;
  hasMotionPreference: boolean;
}

function StatementBuilder({ state, onChange, touched, setTouched, preview, hasMotionPreference }: StatementBuilderProps) {
  const isValid = STATEMENT_FIELDS.every((field) => (state[field.id] ?? '').trim().length > 0);

  const helperColor = isValid ? 'rgba(148, 163, 184, 0.7)' : 'rgba(251, 191, 36, 0.8)';

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>写一句中心句</h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.78)' }}>
          按照“情境 → 价值判断 → 行动指向”的顺序填空。一句中心句就是全文的北极星。
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gap: '14px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
        }}
      >
        {STATEMENT_FIELDS.map((field) => {
          const value = state[field.id] ?? '';
          const invalid = touched && !value.trim();
          return (
            <label
              key={field.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px',
                borderRadius: '16px',
                border: `1px solid ${invalid ? 'rgba(251, 191, 36, 0.8)' : 'rgba(148, 163, 184, 0.25)'}`,
                background: 'rgba(15, 23, 42, 0.55)'
              }}
            >
              <span style={{ fontWeight: 600 }}>{field.label}</span>
              <input
                value={value}
                onChange={(event) => onChange(field.id, event.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={field.placeholder}
                style={{
                  background: 'rgba(2, 6, 23, 0.6)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.35)',
                  padding: '10px 12px',
                  color: 'inherit',
                  fontSize: '0.95rem'
                }}
              />
              <span style={{ fontSize: '0.85rem', color: helperColor }}>{field.helper}</span>
            </label>
          );
        })}
      </div>

      <div
        aria-live="polite"
        style={{
          padding: '18px',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.32)',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(139, 92, 246, 0.12))',
          transition: hasMotionPreference ? undefined : 'transform 180ms ease',
          transform: touched && isValid ? 'translateY(-2px)' : undefined
        }}
      >
        <span style={{ fontSize: '0.8rem', letterSpacing: '0.18em', color: 'rgba(148, 163, 184, 0.78)' }}>
          语句预览
        </span>
        <p style={{ fontSize: '1.1rem', marginTop: '8px', lineHeight: 1.6 }}>{preview}</p>
        {touched && !isValid ? (
          <p style={{ marginTop: '10px', color: 'rgba(251, 191, 36, 0.9)', fontSize: '0.9rem' }}>
            至少填满三个空，中心句才算搭建完成喔。
          </p>
        ) : null}
      </div>
    </section>
  );
}

interface MaterialPickerProps {
  clusters: MaterialCluster[];
  materialLookup: Map<string, MaterialNode & { clusterId: string }>;
  expandedClusters: string[];
  onToggleCluster: (clusterId: string) => void;
  onToggleMaterial: (materialId: string) => void;
  selectedMaterialIds: string[];
  onDragEnd: (event: DragEndEvent) => void;
}

function MaterialPicker({
  clusters,
  materialLookup,
  expandedClusters,
  onToggleCluster,
  onToggleMaterial,
  selectedMaterialIds,
  onDragEnd
}: MaterialPickerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>挑选素材节点</h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.8)' }}>
          展开卡片挑选人物、数据、对比角度。点击即可加入，右侧区域可拖动排序，模拟脑图布局。
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gap: '18px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
        }}
      >
        {clusters.map((cluster) => {
          const expanded = expandedClusters.includes(cluster.id);
          return (
            <article
              key={cluster.id}
              style={{
                borderRadius: '18px',
                border: `1px solid ${cluster.color}33`,
                background: 'rgba(15, 23, 42, 0.5)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'border 160ms ease'
              }}
            >
              <button
                type="button"
                onClick={() => onToggleCluster(cluster.id)}
                aria-expanded={expanded}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{cluster.title}</span>
                  <span style={{ color: 'rgba(148, 163, 184, 0.75)', fontSize: '0.9rem' }}>{cluster.description}</span>
                </div>
                <span aria-hidden style={{ fontSize: '1.4rem', color: cluster.color }}>
                  {expanded ? '−' : '+'}
                </span>
              </button>

              {expanded ? (
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0
                  }}
                >
                  {cluster.nodes.map((node) => {
                    const isActive = selectedMaterialIds.includes(node.id);
                    return (
                      <li key={node.id}>
                        <button
                          type="button"
                          onClick={() => onToggleMaterial(node.id)}
                          aria-pressed={isActive}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            borderRadius: '14px',
                            border: `1px solid ${isActive ? cluster.color : 'rgba(148, 163, 184, 0.24)'}`,
                            background: isActive ? `${cluster.color}22` : 'rgba(2, 6, 23, 0.6)',
                            color: 'inherit',
                            padding: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{node.label}</span>
                          <span style={{ color: 'rgba(148, 163, 184, 0.85)', fontSize: '0.9rem' }}>{node.angle}</span>
                          <span style={{ color: 'rgba(148, 163, 184, 0.6)', fontSize: '0.85rem' }}>{node.spark}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>

      <div
        style={{
          borderRadius: '18px',
          border: '1px dashed rgba(56, 189, 248, 0.4)',
          background: 'rgba(15, 23, 42, 0.52)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>已选素材 ({selectedMaterialIds.length})</h4>
          <span style={{ fontSize: '0.85rem', color: 'rgba(148, 163, 184, 0.78)' }}>
            至少挑 3 个，拖动可调整出现顺序
          </span>
        </header>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={selectedMaterialIds} strategy={rectSwappingStrategy}>
            <div
              role="list"
              style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
              }}
            >
              {selectedMaterialIds.length === 0 ? (
                <p style={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                  还没有素材。展开上方卡片，点击条目即可加入。
                </p>
              ) : null}

              {selectedMaterialIds.map((materialId) => {
                const node = materialLookup.get(materialId);
                if (!node) return null;
                return (
                  <SortableCard
                    key={materialId}
                    id={materialId}
                    className="material-chip"
                    ariaLabel={`素材 ${node.label}`}
                  >
                    <div
                      role="listitem"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid rgba(56, 189, 248, 0.32)',
                        padding: '14px',
                        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18), rgba(2, 132, 199, 0.14))',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>{node.label}</span>
                        <button
                          type="button"
                          onClick={() => onToggleMaterial(materialId)}
                          aria-label={`移除素材 ${node.label}`}
                          style={{
                            border: 'none',
                            background: 'rgba(15, 23, 42, 0.4)',
                            color: 'rgba(226, 232, 240, 0.8)',
                            borderRadius: '999px',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          移除
                        </button>
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'rgba(226, 232, 240, 0.78)' }}>{node.angle}</span>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(148, 163, 184, 0.8)' }}>{node.spark}</span>
                    </div>
                  </SortableCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
}

interface OutlineBuilderProps {
  order: string[];
  lookup: Map<string, OutlineSegment>;
  onDragEnd: (event: DragEndEvent) => void;
  onOutlineNoteChange: (segmentId: string, value: string) => void;
  outlineNotes: OutlineNotes;
  selectedMaterialIds: string[];
  materialLookup: Map<string, MaterialNode & { clusterId: string }>;
}

function OutlineBuilder({
  order,
  lookup,
  onDragEnd,
  onOutlineNoteChange,
  outlineNotes,
  selectedMaterialIds,
  materialLookup
}: OutlineBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>拖拽生成段落提纲</h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.85)' }}>
          拖动左侧小圆点调整段落顺序，给每段写一句任务描述，必要的话勾选上方素材进行分配。
        </p>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ol
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {order.map((segmentId, index) => {
              const segment = lookup.get(segmentId);
              if (!segment) return null;
              return (
                <li key={segmentId}>
                  <SortableCard id={segmentId} ariaLabel={`段落 ${segment.label}`}>
                    <article
                      style={{
                        borderRadius: '18px',
                        border: '1px solid rgba(148, 163, 184, 0.28)',
                        background: 'rgba(2, 6, 23, 0.6)',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <header
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              letterSpacing: '0.16em',
                              color: 'rgba(148, 163, 184, 0.7)'
                            }}
                          >
                            第 {index + 1} 段
                          </span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{segment.label}</h4>
                        </div>
                      </header>

                      <p style={{ color: 'rgba(203, 213, 225, 0.78)', fontSize: '0.95rem' }}>{segment.focus}</p>
                      <p style={{ color: 'rgba(148, 163, 184, 0.7)', fontSize: '0.85rem' }}>提示：{segment.hint}</p>

                      <textarea
                        value={outlineNotes[segmentId] ?? ''}
                        onChange={(event) => onOutlineNoteChange(segmentId, event.target.value)}
                        placeholder="写下这一段准备使用的论点、素材或表达方式"
                        rows={3}
                        style={{
                          resize: 'vertical',
                          minHeight: '96px',
                          borderRadius: '14px',
                          border: '1px solid rgba(148, 163, 184, 0.32)',
                          background: 'rgba(15, 23, 42, 0.65)',
                          color: 'inherit',
                          padding: '12px',
                          fontSize: '0.95rem'
                        }}
                      />

                      {selectedMaterialIds.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {selectedMaterialIds.map((materialId) => {
                            const material = materialLookup.get(materialId);
                            if (!material) return null;
                            return (
                              <span
                                key={`${segmentId}-${materialId}`}
                                style={{
                                  fontSize: '0.78rem',
                                  padding: '4px 10px',
                                  borderRadius: '999px',
                                  background: 'rgba(56, 189, 248, 0.16)',
                                  border: '1px solid rgba(56, 189, 248, 0.3)'
                                }}
                              >
                                {material.label}
                              </span>
                            );
                          })}
                        </div>
                      ) : null}
                    </article>
                  </SortableCard>
                </li>
              );
            })}
          </ol>
        </SortableContext>
      </DndContext>
    </section>
  );
}

interface SidebarContentProps {
  activeStep: SpeedStepId;
  tips: GuidanceTip[];
  selectedPrompt?: string | undefined | null;
  statementComplete: boolean;
  materialsCount: number;
  outlineDone: boolean;
}

function SidebarContent({ activeStep, tips, selectedPrompt, statementComplete, materialsCount, outlineDone }: SidebarContentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>步骤导航</h3>
        <p style={{ color: 'rgba(148, 163, 184, 0.8)' }}>
          当前进行：<strong style={{ color: 'rgba(225, 239, 254, 0.95)' }}>{stepLabel(activeStep)}</strong>
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li style={{ color: 'rgba(148, 163, 184, 0.75)', fontSize: '0.95rem' }}>
            {selectedPrompt ? `审题已聚焦：“${selectedPrompt}”` : '还未选择审题提示'}
          </li>
          <li style={{ color: 'rgba(148, 163, 184, 0.75)', fontSize: '0.95rem' }}>
            {statementComplete ? '中心句 ✅' : '中心句待完善'}
          </li>
          <li style={{ color: 'rgba(148, 163, 184, 0.75)', fontSize: '0.95rem' }}>
            {materialsCount >= 3 ? `素材已选 ${materialsCount} 个` : `素材仅 ${materialsCount} 个，再多准备些`}
          </li>
          <li style={{ color: 'rgba(148, 163, 184, 0.75)', fontSize: '0.95rem' }}>
            {outlineDone ? '段落顺序已调整' : '记得为纲要拖拽调序'}
          </li>
        </ul>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>本步提示</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tips.map((tip) => (
            <li
              key={tip.id}
              style={{
                borderRadius: '14px',
                padding: '12px',
                background: 'rgba(51, 65, 85, 0.35)',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tip.title}</span>
              <span style={{ fontSize: '0.9rem', color: 'rgba(203, 213, 225, 0.78)' }}>{tip.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>练习建议</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PRACTICE_SUGGESTIONS.map((suggestion) => (
            <li
              key={suggestion.id}
              style={{
                borderRadius: '14px',
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(148, 163, 184, 0.24)'
              }}
            >
              <strong style={{ display: 'block', marginBottom: '4px' }}>{suggestion.title}</strong>
              <span style={{ fontSize: '0.9rem', color: 'rgba(148, 163, 184, 0.85)' }}>{suggestion.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        style={{
          borderRadius: '18px',
          padding: '18px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.18))',
          color: 'rgba(15, 23, 42, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{CTA_CONTENT.headline}</h4>
        <p style={{ fontSize: '0.95rem' }}>{CTA_CONTENT.body}</p>
        <a
          href={CTA_CONTENT.actionHref}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '6px',
            padding: '10px 14px',
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.9)',
            color: 'rgba(226, 232, 240, 0.96)',
            textDecoration: 'none',
            fontWeight: 600
          }}
        >
          {CTA_CONTENT.actionLabel} ↗
        </a>
        <span style={{ fontSize: '0.85rem', color: 'rgba(15, 23, 42, 0.8)' }}>{CTA_CONTENT.secondaryHint}</span>
      </section>
    </div>
  );
}

function stepLabel(step: SpeedStepId) {
  switch (step) {
    case 'understand':
      return '审题拆解';
    case 'angle':
      return '中心立意';
    case 'material':
      return '素材布置';
    case 'outline':
      return '结构搭建';
    default:
      return '流程';
  }
}
