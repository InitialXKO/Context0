import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../../components/ui/Breadcrumbs';
import { ToolDetailShell } from '../../../components/tools/ToolDetailShell';
import { getRelatedTools, getToolById, toolIds } from '../../../lib/tools';

interface ToolPageParams {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return toolIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: ToolPageParams): Promise<Metadata> {
  const tool = getToolById(params.id);

  if (!tool) {
    return {
      title: 'Tool not found · Context0',
      description: 'The requested tool could not be located in the Context0 playbook.',
    };
  }

  const description = tool.summary;

  return {
    title: `${tool.name} · Context0 Tool Playbook`,
    description,
    openGraph: {
      title: `${tool.name} · Context0 Tool Playbook`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} · Context0 Tool Playbook`,
      description,
    },
  };
}

export default function ToolDetailPage({ params }: ToolPageParams) {
  const tool = getToolById(params.id);

  if (!tool) {
    notFound();
  }

  const related = getRelatedTools(tool);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: tool.name },
        ]}
      />
      <ToolDetailShell tool={tool} related={related} />
    </>
  );
}
