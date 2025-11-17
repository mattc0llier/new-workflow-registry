import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CompanyLogo } from '@/components/company-logo';
import { INTEGRATIONS, STEPS, WORKFLOWS } from '@/lib/elements-data';
import { ExternalLink } from 'lucide-react';

export default function IntegrationPage({
  params,
}: {
  params: { id: string };
}) {
  const integration = INTEGRATIONS.find((i) => i.id === params.id);

  if (!integration) {
    notFound();
  }

  const steps = STEPS.filter((s) => integration.steps.includes(s.id));
  const relatedWorkflows = WORKFLOWS.filter((w) =>
    w.steps.some((ws) => integration.steps.includes(ws.stepId))
  );

  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[860px] px-4 md:mx-auto md:px-6">
        <div className="prose prose-fd mt-12">
          {/* Header */}
          <div className="not-prose mb-8">
            <div className="mb-4 flex items-center gap-3">
              <CompanyLogo
                domain={integration.domain}
                name={integration.name}
                size={64}
              />
              <div>
                <h1 className="text-4xl font-bold">{integration.name}</h1>
                <p className="text-muted-foreground text-lg mt-2">
                  {integration.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              {integration.website && (
                <a
                  href={integration.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Website
                </a>
              )}
              {integration.docsUrl && (
                <a
                  href={integration.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Documentation
                </a>
              )}
            </div>
          </div>

          {/* Authentication */}
          {integration.authType && (
            <div className="not-prose mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge>{integration.authType}</Badge>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Setup Instructions */}
          {integration.setupInstructions && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">
                Setup Instructions
              </h2>
              <div className="not-prose bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {integration.setupInstructions}
                </pre>
              </div>
            </div>
          )}

          {/* Available Steps */}
          <div className="not-prose mb-8">
            <h2 className="text-2xl font-semibold mb-3">Available Steps</h2>
            <p className="text-muted-foreground mb-4">
              {steps.length} step{steps.length !== 1 ? 's' : ''} available for{' '}
              {integration.name}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step) => (
                <Link key={step.id} href={`/steps/${step.id}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{step.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{step.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {step.description}
                          </CardDescription>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {step.tags.map((tag) => (
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
              ))}
            </div>
          </div>

          {/* Example Workflows */}
          {relatedWorkflows.length > 0 && (
            <div className="not-prose mb-8">
              <h2 className="text-2xl font-semibold mb-3">Example Workflows</h2>
              <p className="text-muted-foreground mb-4">
                Workflows using {integration.name} steps
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedWorkflows.map((workflow) => (
                  <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{workflow.icon}</span>
                          <div>
                            <CardTitle className="text-lg">
                              {workflow.name}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {workflow.description}
                            </CardDescription>
                            <div className="mt-3 flex gap-2">
                              <Badge variant="outline">
                                {workflow.difficulty}
                              </Badge>
                              <Badge variant="secondary">
                                {workflow.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="not-prose mt-12 pt-6 border-t">
            <Link
              href="/integrations"
              className="text-primary hover:underline inline-flex items-center gap-2"
            >
              ← Back to Integrations
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return INTEGRATIONS.map((integration) => ({
    id: integration.id,
  }));
}
