'use client';

import { motion } from 'framer-motion';
import type { ToolDefinition } from '../../lib/tools';
import { ToolCard } from './ToolCard';
import styles from './ToolListing.module.css';

type ToolsListingProps = {
  tools: ToolDefinition[];
};

export function ToolsListing({ tools }: ToolsListingProps) {
  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <section className={styles.hero}>
        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          Context0 Tool Playbook
        </motion.h1>
        <motion.p
          className={styles.heroLead}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Master the seven context-management tools that power Context0. Each card distills when to
          reach for a tool, how to wield it, and anti-patterns to avoid so your agents stay grounded,
          efficient, and trustworthy.
        </motion.p>
        <motion.div
          className={styles.metaGrid}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Tools</span>
            <span className={styles.metaValue}>{tools.length}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Static delivery</span>
            <span className={styles.metaValue}>Pre-rendered</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Last reviewed</span>
            <span className={styles.metaValue}>October 2024</span>
          </div>
        </motion.div>
      </section>

      <div className={styles.grid}>
        {tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>
    </motion.main>
  );
}
