import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { STEPS, WORKFLOWS } from '@/lib/elements-data';
import { Icon } from '@/lib/icon-map';

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

  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[860px] px-4 md:mx-auto md:px-6">
        <div className="prose prose-fd mt-12">
          {/* Header */}
          <div className="not-prose mb-8">
            <div className="mb-4 flex items-center gap-3">
              <Icon name={workflow.icon} size={36} />
              <div>
                <h1 className="text-4xl font-bold">{workflow.name}</h1>
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
            <h2 className="text-2xl font-semibold mb-3">Use Case</h2>
            <p className="text-muted-foreground text-lg">{workflow.useCase}</p>
          </div>

          {/* Prerequisites */}
          {workflow.prerequisites && workflow.prerequisites.length > 0 && (
            <div className="not-prose mb-8">
              <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
              <Card className="bg-muted/30">
                <CardContent className="pt-6 pb-6">
                  <ul className="space-y-3">
                    {workflow.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-primary mt-0.5 text-lg">✓</span>
                        <span className="text-base leading-relaxed">
                          {prereq}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step Sequence */}
          <div className="not-prose mb-8">
            <h2 className="text-2xl font-semibold mb-3">Workflow Steps</h2>
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
            <h2 className="text-2xl font-semibold mb-3">Complete Code</h2>
            <CodeBlock
              code={workflow.code}
              lang="ts"
              codeblock={{
                className:
                  'not-prose bg-muted p-4 rounded-lg overflow-x-auto text-sm',
              }}
            />
          </div>

          {/* Installation */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">Installation</h2>
            <p className="text-muted-foreground mb-3">
              Install the required dependencies for all steps:
            </p>
            <pre className="not-prose bg-muted p-4 rounded-lg overflow-x-auto">
              <code>npm install @vercel/workflow</code>
            </pre>
          </div>

          {/* Back Link */}
          <div className="not-prose mt-12 pt-6 border-t">
            <Link
              href="/workflows"
              className="text-primary hover:underline inline-flex items-center gap-2"
            >
              ← Back to Workflows
            </Link>
          </div>
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
