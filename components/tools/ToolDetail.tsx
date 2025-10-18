'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type { ToolDefinition } from '../../lib/tools';
import { useMediaQuery } from '../../hooks/use-media-query';
import { CodeBlock } from '../ui/CodeBlock';
import { ToolCard } from './ToolCard';
import styles from './ToolDetail.module.css';

type ToolDetailProps = {
  tool: ToolDefinition;
  related: ToolDefinition[];
};

type ExampleKey = 'success' | 'failure';

const exampleVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export function ToolDetail({ tool, related }: ToolDetailProps) {
  const isNarrow = useMediaQuery('(max-width: 880px)');
  const [activeExample, setActiveExample] = useState<ExampleKey>('success');

  useEffect(() => {
    if (!isNarrow) {
      setActiveExample('success');
    }
  }, [isNarrow]);

  const examples = useMemo(
    () => [
      { key: 'success' as const, title: '✅ Effective pattern', data: tool.successExample },
      { key: 'failure' as const, title: '❌ Anti-pattern', data: tool.failureExample },
    ],
    [tool.failureExample, tool.successExample]
  );

  const selectedExample = examples.find((example) => example.key === activeExample) ?? examples[0];

  return (
    <div className={styles.wrapper}>
      <section className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.preHeading}>Tool profile</span>
          <h1 className={styles.title}>{tool.name}</h1>
          <p className={styles.description}>{tool.description}</p>
          <div className={styles.tags}>
            {tool.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link href="/tools" className="btn btn--ghost">
            ← Back to tools
          </Link>
          <a href={tool.cta.href} target="_blank" rel="noreferrer" className="btn btn--primary">
            {tool.cta.label}
          </a>
        </div>
      </section>

      <section className={styles.mnemonic}>
        <h2 className={styles.sectionTitle}>Mnemonic</h2>
        <p className={styles.mnemonicBody}>{tool.mnemonic}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>When to reach for it</h2>
        <ul className={styles.list}>
          {tool.callouts.map((callout) => (
            <li key={callout}>{callout}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Field-tested tips</h2>
        <ul className={clsx(styles.list, styles.tipList)}>
          {tool.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className={clsx(styles.section, styles.examples)}>
        <div className={styles.examplesHeader}>
          <h2 className={styles.sectionTitle}>Usage patterns</h2>
          <div className={styles.tabs} role="tablist" aria-label="Tool usage examples">
            {examples.map((example) => (
              <button
                key={example.key}
                type="button"
                role="tab"
                aria-selected={activeExample === example.key}
                className={clsx(styles.tabButton, activeExample === example.key && styles.tabButtonActive)}
                onClick={() => setActiveExample(example.key)}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>

        {isNarrow ? (
          <AnimatePresence mode="wait">
            <motion.article
              key={selectedExample.key}
              className={styles.exampleCard}
              variants={exampleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <header className={styles.exampleHeader}>
                <h3>{selectedExample.data.title}</h3>
                <p>{selectedExample.data.description}</p>
              </header>
              <CodeBlock code={selectedExample.data.code} />
              <p className={styles.exampleExplanation}>{selectedExample.data.explanation}</p>
            </motion.article>
          </AnimatePresence>
        ) : (
          <div className={styles.exampleGrid}>
            {examples.map((example) => (
              <motion.article
                key={example.key}
                className={styles.exampleCard}
                variants={exampleVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <header className={styles.exampleHeader}>
                  <h3>{example.data.title}</h3>
                  <p>{example.data.description}</p>
                </header>
                <CodeBlock code={example.data.code} />
                <p className={styles.exampleExplanation}>{example.data.explanation}</p>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className={clsx(styles.section, styles.related)}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.sectionTitle}>Related tools</h2>
            <p className={styles.relatedLead}>
              Chain these tools to orchestrate resilient, context-savvy workflows.
            </p>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((item, index) => (
              <ToolCard key={item.id} tool={item} compact index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
