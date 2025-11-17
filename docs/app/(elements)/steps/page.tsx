'use client';

import { Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { STEPS } from '@/lib/elements-data';

const CATEGORIES = [
  'All',
  'Core',
  'AI',
  'Data',
  'Communication',
  'Payment',
  'Storage',
];

export default function StepsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSteps = STEPS.filter((step) => {
    const matchesSearch =
      step.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'All' || step.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[1280px] px-4 md:mx-auto md:px-6">
        <div className="prose prose-fd mt-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Steps</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Browse our searchable directory of pre-built integration steps for
            popular services and APIs.
          </p>

          {/* Search and Filters */}
          <div className="not-prose mb-8 space-y-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search steps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    selectedCategory === category
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-accent'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="not-prose text-muted-foreground mb-6 text-sm">
            Showing {filteredSteps.length} step
            {filteredSteps.length !== 1 ? 's' : ''}
          </div>

          {/* Steps Grid */}
          <div className="not-prose grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSteps.map((step) => (
              <Link key={step.id} href={`/steps/${step.id}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-md h-full">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex size-12 items-center justify-center rounded-lg border bg-gradient-to-br from-background to-muted text-2xl">
                        {step.icon}
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
            <div className="not-prose py-12 text-center">
              <div className="text-muted-foreground mb-2 text-6xl">🔍</div>
              <h3 className="mb-2 text-lg font-semibold">No steps found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
