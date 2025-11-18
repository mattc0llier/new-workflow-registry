'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/search-input';
import { cn } from '@/lib/utils';
import { WORKFLOWS } from '@/lib/elements-data';
import { Icon } from '@/lib/icon-map';

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredWorkflows = WORKFLOWS.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || workflow.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate category counts
  const categoryCounts = WORKFLOWS.reduce(
    (acc, workflow) => {
      acc[workflow.category] = (acc[workflow.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const categories = [
    { id: 'all', name: 'All categories', count: WORKFLOWS.length },
    { id: 'Core', name: 'Core', count: categoryCounts['Core'] || 0 },
    { id: 'AI', name: 'AI', count: categoryCounts['AI'] || 0 },
    { id: 'Data', name: 'Data', count: categoryCounts['Data'] || 0 },
    {
      id: 'Communication',
      name: 'Communication',
      count: categoryCounts['Communication'] || 0,
    },
    { id: 'Payment', name: 'Payment', count: categoryCounts['Payment'] || 0 },
    { id: 'Storage', name: 'Storage', count: categoryCounts['Storage'] || 0 },
  ];

  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[1400px] px-4 md:mx-auto md:px-6">
        <div className="mt-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">
              Workflows
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover complete workflow examples that combine multiple steps to
              solve real-world problems.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-xl">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search workflows..."
              />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                          selectedCategory === category.id
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                        )}
                      >
                        <div
                          className={cn(
                            'size-1.5 rounded-full',
                            selectedCategory === category.id
                              ? 'bg-primary'
                              : 'bg-muted-foreground/40'
                          )}
                        />
                        <span className="flex-1 text-left">
                          {category.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold">
                    {filteredWorkflows.length} workflow
                    {filteredWorkflows.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Workflows Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWorkflows.map((workflow) => (
                  <Link key={workflow.id} href={`/workflows/${workflow.id}`}>
                    <Card className="group cursor-pointer transition-all hover:shadow-md h-full">
                      <CardHeader>
                        <div className="flex items-start gap-3 mb-3">
                          <Icon name={workflow.icon} size={28} />
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {workflow.name}
                            </CardTitle>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="outline">
                                {workflow.difficulty}
                              </Badge>
                              <Badge variant="secondary">
                                {workflow.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm">
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

              {/* Empty State */}
              {filteredWorkflows.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-muted-foreground mb-2 text-6xl">🔍</div>
                  <h3 className="mb-2 text-lg font-semibold">
                    No workflows found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}

              {/* Footer CTA */}
              <div className="mt-12 pt-6 border-t">
                <p className="text-muted-foreground">
                  Looking for something specific? Browse our{' '}
                  <Link href="/steps" className="text-primary hover:underline">
                    Steps Directory
                  </Link>{' '}
                  to build your own custom workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
