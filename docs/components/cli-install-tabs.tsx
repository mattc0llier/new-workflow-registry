'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/ui/code-block';

interface CliInstallTabsProps {
  stepId: string;
}

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export function CliInstallTabs({ stepId }: CliInstallTabsProps) {
  const [selectedPm, setSelectedPm] = useState<PackageManager>('pnpm');

  const commands: Record<PackageManager, string> = {
    pnpm: `pnpm dlx shadcn@latest add @workflow/${stepId}`,
    npm: `npx shadcn@latest add @workflow/${stepId}`,
    yarn: `yarn dlx shadcn@latest add @workflow/${stepId}`,
    bun: `bunx shadcn@latest add @workflow/${stepId}`,
  };

  const packageManagers: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

  return (
    <div className="mb-3">
      <div className="flex gap-2 mb-3">
        {packageManagers.map((pm) => (
          <button
            key={pm}
            type="button"
            onClick={() => setSelectedPm(pm)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              selectedPm === pm
                ? 'bg-muted'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {pm}
          </button>
        ))}
      </div>

      <CodeBlock>
        <pre>
          <code className="language-bash">{commands[selectedPm]}</code>
        </pre>
      </CodeBlock>
    </div>
  );
}
