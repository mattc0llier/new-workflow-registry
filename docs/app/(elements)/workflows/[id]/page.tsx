import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { codeToHtml } from 'shiki';
import { CliInstallTabs } from '@/components/cli-install-tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { STEPS, WORKFLOWS } from '@/lib/elements-data';
import { Icon } from '@/lib/icon-map';
import { cn } from '@/lib/utils';

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workflow = WORKFLOWS.find((w) => w.id === id);

  if (!workflow) {
    notFound();
  }

  const workflowSteps = workflow.steps
    .map((ws) => ({
      ...ws,
      step: STEPS.find((s) => s.id === ws.stepId),
    }))
    .filter(
      (ws): ws is typeof ws & { step: NonNullable<typeof ws.step> } =>
        ws.step !== undefined
    );

  // Pre-render code with Shiki (server-side)
  const codeHtml = await codeToHtml(workflow.code, {
    lang: 'typescript',
    themes: {
      light: 'github-light-default',
      dark: 'github-dark-default',
    },
    defaultColor: false,
  });

  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[1280px] px-4 md:mx-auto md:px-6">
        {/* Breadcrumb */}
        <div className="mt-4 mb-6 text-sm text-muted-foreground">
          <Link href="/workflows" className="hover:text-foreground">
            Workflows
          </Link>
          {' / '}
          <span>{workflow.id}</span>
        </div>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8 mt-12">
              <div className="mb-4 flex items-center gap-3">
                <Icon name={workflow.icon} size={36} />
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    {workflow.name}
                  </h1>
                  <p className="text-muted-foreground text-lg mt-2">
                    {workflow.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{workflow.category}</Badge>
                    <Badge>{workflow.difficulty}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Case */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Use Case</h2>
              <p className="text-muted-foreground text-lg">
                {workflow.useCase}
              </p>
            </div>

            {/* Prerequisites */}
            {workflow.prerequisites && workflow.prerequisites.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <div className="p-4 border rounded-lg">
                  <ul className="space-y-3">
                    {workflow.prerequisites.map((prereq) => (
                      <li key={prereq} className="flex items-start gap-3">
                        <span className="text-primary mt-0.5 text-lg">✓</span>
                        <span className="text-base leading-relaxed">
                          {prereq}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Step Sequence */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Workflow Steps</h2>
              <p className="text-muted-foreground mb-4">
                This workflow uses {workflowSteps.length} step
                {workflowSteps.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-4">
                {workflowSteps.map((ws, idx) => (
                  <div key={ws.stepId}>
                    <Link href={`/steps/${ws.stepId}`}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                              {ws.order}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Icon name={ws.step.icon} size={20} />
                                <CardTitle className="text-lg">
                                  {ws.step.name}
                                </CardTitle>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                {ws.description}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-1">
                                {ws.step.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                    {idx < workflowSteps.length - 1 && (
                      <div className="flex justify-center pt-6 pb-3">
                        <ArrowDown className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Code */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Complete Code</h2>
              <CodeBlock className="relative bg-fd-background rounded-md shadow-none">
                <Pre
                  className={cn(
                    '[&_.highlighted]:!bg-primary-blue/25',
                    '[&_.highlighted]:!border-primary-blue/50',
                    '[&_.highlighted::after]:!text-muted-foreground'
                  )}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Pre-rendered safe HTML from Shiki
                  dangerouslySetInnerHTML={{ __html: codeHtml }}
                />
              </CodeBlock>
            </div>

            {/* Installation */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Installation</h2>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Install this workflow using the CLI:
                </p>
                <CliInstallTabs stepId={workflow.id} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Details Card */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Category
                    </div>
                    <div className="font-medium">{workflow.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Difficulty
                    </div>
                    <div className="font-medium">{workflow.difficulty}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Steps
                    </div>
                    <div className="font-medium">{workflowSteps.length}</div>
                  </div>
                </div>
              </div>

              {/* Related Steps Card */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Steps Used</h3>
                <div className="space-y-2">
                  {workflowSteps.map((ws) => (
                    <Link key={ws.stepId} href={`/steps/${ws.stepId}`}>
                      <div className="text-sm hover:text-primary cursor-pointer py-1.5 flex items-center gap-2">
                        <Icon name={ws.step.icon} size={16} />
                        <span>{ws.step.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return WORKFLOWS.map((workflow) => ({
    id: workflow.id,
  }));
}
