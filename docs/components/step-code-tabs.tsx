'use client';

import { useState } from 'react';
import { CopyButton } from '@/components/copy-button';
import { cn } from '@/lib/utils';

interface StepCodeTabsProps {
  stepName: string;
  stepId: string;
  code: string;
  codeHtml: string;
  usageExample: string;
  usageExampleHtml: string;
  fileName: string;
}

export function StepCodeTabs({
  stepName,
  stepId,
  code,
  codeHtml,
  usageExample,
  usageExampleHtml,
  fileName,
}: StepCodeTabsProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'usage'>('code');

  return (
    <div className="mb-8">
      <div className="border-b mb-4">
        <div className="flex gap-6">
          <button
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
            <CopyButton
              text={code}
              size="sm"
              variant="ghost"
              className="h-8 px-2"
            />
          </div>
          <div
            className={cn(
              'overflow-auto text-sm py-6 border [&_pre]:!bg-transparent'
            )}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Pre-rendered safe HTML from Shiki
            dangerouslySetInnerHTML={{ __html: codeHtml }}
          />
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="relative">
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <span className="text-muted-foreground text-xs">
              workflows/example.ts
            </span>
            <CopyButton
              text={usageExample}
              size="sm"
              variant="ghost"
              className="h-8 px-2"
            />
          </div>
          <div
            className={cn(
              'overflow-auto text-sm py-6 border [&_pre]:!bg-transparent'
            )}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: Pre-rendered safe HTML from Shiki
            dangerouslySetInnerHTML={{ __html: usageExampleHtml }}
          />
        </div>
      )}
    </div>
  );
}
