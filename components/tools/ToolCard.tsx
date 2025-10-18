'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { ToolDefinition } from '../../lib/tools';
import styles from './ToolCard.module.css';

type ToolCardProps = {
  tool: ToolDefinition;
  index?: number;
  compact?: boolean;
};

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function ToolCard({ tool, index = 0, compact = false }: ToolCardProps) {
  return (
    <motion.article
      className={clsx(styles.card, compact && styles.compact)}
      initial="hidden"
      animate="visible"
      whileHover={{ translateY: -6 }}
      whileTap={{ scale: 0.98 }}
      variants={variants}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 140, damping: 18 }}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{tool.name}</h3>
        <p className={styles.summary}>{tool.summary}</p>
      </div>

      <div className={styles.tags}>
        {tool.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      {!compact && (
        <div className={styles.callouts}>
          {tool.callouts.slice(0, 3).map((callout) => (
            <p key={callout}>• {callout}</p>
          ))}
        </div>
      )}

      <div className={styles.ctaRow}>
        <Link href={`/tools/${tool.id}`} className="btn btn--primary">
          Open playbook
        </Link>
        <a href={tool.cta.href} target="_blank" rel="noreferrer" className={styles.docLink}>
          {tool.cta.label}
          <span aria-hidden className={styles.arrow}>
            ↗
          </span>
        </a>
      </div>
    </motion.article>
  );
}
