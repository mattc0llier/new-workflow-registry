'use client';

import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StepCodeTabsProps {
  codeHtml: string;
  usageExampleHtml: string;
  fileName: string;
}

export function StepCodeTabs({
  codeHtml,
  usageExampleHtml,
  fileName,
}: StepCodeTabsProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'usage'>('code');

  return (
    <div className="mb-8">
      <div className="border-b mb-4">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'code'
                ? 'border-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Code
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('usage')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'usage'
                ? 'border-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Usage
          </button>
        </div>
      </div>

      {/* Code Tab */}
      {activeTab === 'code' && (
        <div className="relative">
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <span className="text-muted-foreground text-xs">
              steps/{fileName}
            </span>
          </div>
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
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="relative">
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <span className="text-muted-foreground text-xs">
              workflows/example.ts
            </span>
          </div>
          <CodeBlock className="relative bg-fd-background rounded-md shadow-none">
            <Pre
              className={cn(
                '[&_.highlighted]:!bg-primary-blue/25',
                '[&_.highlighted]:!border-primary-blue/50',
                '[&_.highlighted::after]:!text-muted-foreground'
              )}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Pre-rendered safe HTML from Shiki
              dangerouslySetInnerHTML={{ __html: usageExampleHtml }}
            />
          </CodeBlock>
        </div>
      )}
    </div>
  );
}
