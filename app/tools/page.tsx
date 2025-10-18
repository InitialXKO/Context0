import type { Metadata } from 'next';
import { toolDefinitions } from '../../lib/tools';
import { ToolsListing } from '../../components/tools/ToolsListing';

export const metadata: Metadata = {
  title: 'Tool Playbook · Context0',
  description:
    'Animated guides, mnemonics, and best practices for each of the seven Context0 tools. Statically generated for instant access.',
};

export default function ToolsPage() {
  return <ToolsListing tools={toolDefinitions} />;
}
