'use client';

import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WORKFLOWS } from '@/lib/elements-data';

export default function WorkflowsPage() {
  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[1280px] px-4 md:mx-auto md:px-6">
        <div className="prose prose-fd mt-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Discover complete workflow examples that combine multiple steps to
            solve real-world problems. {WORKFLOWS.length} workflow
            {WORKFLOWS.length !== 1 ? 's' : ''} available.
          </p>

          {/* Workflows Grid */}
          <div className="not-prose grid gap-6 sm:grid-cols-2">
            {WORKFLOWS.map((workflow) => (
              <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-4xl">{workflow.icon}</span>
                      <div className="flex-1">
                        <CardTitle className="text-xl">
                          {workflow.name}
                        </CardTitle>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline">{workflow.difficulty}</Badge>
                          <Badge variant="secondary">{workflow.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {workflow.description}
                    </CardDescription>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-muted-foreground text-sm">
                        Uses {workflow.steps.length} step
                        {workflow.steps.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <div className="not-prose mt-12 pt-6 border-t">
            <p className="text-muted-foreground mb-4">
              Looking for something specific? Browse our{' '}
              <Link href="/steps" className="text-primary hover:underline">
                Steps Directory
              </Link>{' '}
              to build your own custom workflows.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
