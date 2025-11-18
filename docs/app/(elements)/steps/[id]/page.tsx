import Link from 'next/link';
import { notFound } from 'next/navigation';
import { codeToHtml } from 'shiki';
import { CliInstallTabs } from '@/components/cli-install-tabs';
import { CompanyLogo } from '@/components/company-logo';
import { StepCodeTabs } from '@/components/step-code-tabs';
import { Badge } from '@/components/ui/badge';
import { INTEGRATIONS, STEPS, WORKFLOWS } from '@/lib/elements-data';
import { Icon } from '@/lib/icon-map';

// Convert kebab-case to camelCase for function names
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const step = STEPS.find((s) => s.id === id);

  if (!step) {
    notFound();
  }

  const integration = step.integration
    ? INTEGRATIONS.find((i) => i.id === step.integration)
    : null;

  const workflows = step.usedInWorkflows
    ? WORKFLOWS.filter((w) => step.usedInWorkflows?.includes(w.id))
    : [];

  const fileName = `${step.id}.tsx`;

  // Generate usage example
  const functionName = toCamelCase(step.id);
  const usageExample = `import { ${functionName} } from '@/steps/${step.id}';

export async function myWorkflow() {
  "use workflow";

  // Call the step - will automatically retry on transient failures
  const result = await ${functionName}({
    // Add your parameters here
  });

  return result;
}`;

  // Pre-render code blocks with Shiki (server-side)
  const codeHtml = await codeToHtml(step.code, {
    lang: 'typescript',
    themes: {
      light: 'github-light-default',
      dark: 'github-dark-default',
    },
    defaultColor: false,
  });

  const usageExampleHtml = await codeToHtml(usageExample, {
    lang: 'typescript',
    themes: {
      light: 'github-light-default',
      dark: 'github-dark-default',
    },
    defaultColor: false,
  });

  // Related steps from the same integration
  const relatedSteps = integration
    ? STEPS.filter(
        (s) => s.integration === integration.id && s.id !== step.id
      ).slice(0, 3)
    : [];

  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[1400px] px-4 md:mx-auto md:px-6">
        {/* Breadcrumb */}
        <div className="mt-4 mb-6 text-sm text-muted-foreground">
          <Link href="/steps" className="hover:text-foreground">
            Steps
          </Link>
          {' / '}
          <span>{step.id}</span>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* 1. Heading and Subheading */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-3">{step.name}</h1>
              <p className="text-muted-foreground text-xl">
                {step.description}
              </p>
            </div>

            {/* 2. Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="secondary">{step.category}</Badge>
              {step.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* 3. What the step does in more detail */}
            {integration && (
              <div className="mb-8">
                <p className="text-base leading-relaxed">
                  This step integrates with {integration.name} to{' '}
                  {step.description.toLowerCase()}. It provides a clean,
                  type-safe interface for working with the {integration.name}{' '}
                  API within your Vercel Workflow.
                </p>
              </div>
            )}

            {/* 4. Code and Usage Tabs */}
            <StepCodeTabs
              codeHtml={codeHtml}
              usageExampleHtml={usageExampleHtml}
              fileName={fileName}
            />

            {/* 5. Installation Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Installation</h2>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Run the following command to install{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                    {fileName}
                  </code>
                </p>

                {/* CLI Tabs */}
                <CliInstallTabs stepId={step.id} />
              </div>

              {/* Environment Variables */}
              {step.envVars && step.envVars.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Environment Variables
                  </h3>
                  <div className="space-y-3">
                    {step.envVars.map((env) => (
                      <div key={env.name} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {env.name}
                          </code>
                          {env.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {env.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {step.dependencies && step.dependencies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dependencies</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {step.dependencies.map((dep) => (
                        <a
                          key={dep}
                          href={`https://www.npmjs.com/package/${dep}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono bg-muted hover:bg-muted/80 px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1"
                        >
                          {dep}
                          <svg
                            className="w-3 h-3 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-label="External link"
                          >
                            <title>External link</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Workflows this step is used in */}
            {workflows.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Used in Workflows</h2>
                <p className="text-muted-foreground mb-4">
                  This step is used in the following workflows:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {workflows.map((workflow) => (
                    <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
                      <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer h-full">
                        <div className="flex items-start gap-3">
                          <Icon name={workflow.icon} size={20} />
                          <div className="flex-1">
                            <h4 className="text-base font-semibold mb-1">
                              {workflow.name}
                            </h4>
                            <p className="text-muted-foreground text-xs line-clamp-2">
                              {workflow.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Details */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Category
                    </div>
                    <div className="font-medium">{step.category}</div>
                  </div>
                  {integration && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Integration
                      </div>
                      <Link href={`/integrations/${integration.id}`}>
                        <div className="flex items-center gap-2 hover:text-primary cursor-pointer">
                          <CompanyLogo
                            domain={integration.domain}
                            name={integration.name}
                            size={20}
                          />
                          <span className="font-medium">
                            {integration.name}
                          </span>
                        </div>
                      </Link>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Author
                    </div>
                    <div className="font-medium">Workflow Elements</div>
                  </div>
                  {step.dependencies && step.dependencies.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Dependencies
                      </div>
                      <div className="font-medium">
                        {step.dependencies.length}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Steps */}
              {(relatedSteps.length > 0 || workflows.length > 0) && (
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Related</h3>
                  <div className="space-y-2">
                    {relatedSteps.map((relatedStep) => (
                      <Link
                        key={relatedStep.id}
                        href={`/steps/${relatedStep.id}`}
                      >
                        <div className="text-sm hover:text-primary cursor-pointer py-1.5 flex items-center gap-2">
                          <Icon name={relatedStep.icon} size={16} />
                          <span>{relatedStep.name}</span>
                        </div>
                      </Link>
                    ))}
                    {workflows.map((workflow) => (
                      <Link
                        key={workflow.id}
                        href={`/workflows/${workflow.id}`}
                      >
                        <div className="text-sm hover:text-primary cursor-pointer py-1.5 flex items-center gap-2">
                          <Icon name={workflow.icon} size={16} />
                          <span>{workflow.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return STEPS.map((step) => ({
    id: step.id,
  }));
}
