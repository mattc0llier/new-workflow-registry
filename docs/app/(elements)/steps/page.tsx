'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SearchInput } from '@/components/search-input';
import { cn } from '@/lib/utils';
import { STEPS } from '@/lib/elements-data';
import { Icon } from '@/lib/icon-map';

export default function StepsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSteps = STEPS.filter((step) => {
    const matchesSearch =
      step.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' || step.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate category counts
  const categoryCounts = STEPS.reduce(
    (acc, step) => {
      acc[step.category] = (acc[step.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const categories = [
    { id: 'all', name: 'All categories', count: STEPS.length },
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
            <h1 className="mb-2 text-4xl font-bold tracking-tight">Steps</h1>
            <p className="text-muted-foreground text-lg">
              Browse our searchable directory of pre-built integration steps for
              popular services and APIs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-xl">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search steps..."
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
                    {filteredSteps.length} step
                    {filteredSteps.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Steps Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSteps.map((step) => (
                  <Link key={step.id} href={`/steps/${step.id}`}>
                    <Card className="group cursor-pointer transition-all hover:shadow-md h-full">
                      <CardHeader>
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex size-12 items-center justify-center rounded-lg border bg-gradient-to-br from-background to-muted">
                            <Icon name={step.icon} size={20} />
                          </div>
                          <Badge variant="secondary">{step.category}</Badge>
                        </div>
                        <CardTitle className="text-lg">{step.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {step.tags && step.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {step.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {filteredSteps.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-muted-foreground mb-2 text-6xl">🔍</div>
                  <h3 className="mb-2 text-lg font-semibold">No steps found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
