'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ToolDefinition } from '../../lib/tools';
import { ToolDetail } from './ToolDetail';

type ToolDetailShellProps = {
  tool: ToolDefinition;
  related: ToolDefinition[];
};

export function ToolDetailShell({ tool, related }: ToolDetailShellProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tool.id}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -28 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <ToolDetail tool={tool} related={related} />
      </motion.div>
    </AnimatePresence>
  );
}
