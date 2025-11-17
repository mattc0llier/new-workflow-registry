'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CompanyLogo } from '@/components/company-logo';
import { INTEGRATIONS } from '@/lib/elements-data';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all', name: 'All categories', count: 0 },
  { id: 'Core', name: 'Core', count: 0 },
  { id: 'AI', name: 'AI', count: 0 },
  { id: 'Data', name: 'Data', count: 0 },
  { id: 'Communication', name: 'Communication', count: 0 },
  { id: 'Payment', name: 'Payment', count: 0 },
  { id: 'Storage', name: 'Storage', count: 0 },
];

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredIntegrations = INTEGRATIONS.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || !selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex w-full min-w-0 flex-col">
      <div className="w-full max-w-[1400px] px-4 md:mx-auto md:px-6">
        <div className="mt-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">
              Best app & software integrations
            </h1>
            <p className="text-muted-foreground text-lg">
              Optimize your workflows with these top software integrations.
              Seamlessly move and transform data between different apps.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-5 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search for integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-base"
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
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
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
                    {filteredIntegrations.length} integrations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Sort</span>
                  <button className="flex items-center gap-1 text-sm font-medium">
                    Popularity
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              </div>

              {/* Integrations Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredIntegrations.map((integration) => (
                  <Link
                    key={integration.id}
                    href={`/integrations/${integration.id}`}
                  >
                    <Card className="group h-full cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card">
                      <CardHeader className="pb-4">
                        <div className="mb-3">
                          <CompanyLogo
                            domain={integration.domain}
                            name={integration.name}
                            size={48}
                          />
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {integration.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <CardDescription className="line-clamp-2 text-sm">
                          {integration.description}
                        </CardDescription>
                        <div className="mt-4 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {integration.steps.length} step
                            {integration.steps.length !== 1 ? 's' : ''}
                          </span>
                          {integration.authType && (
                            <Badge variant="outline" className="text-xs">
                              {integration.authType}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {filteredIntegrations.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-muted-foreground mb-2 text-6xl">🔍</div>
                  <h3 className="mb-2 text-lg font-semibold">
                    No integrations found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search
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
