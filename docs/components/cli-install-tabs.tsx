'use client';

import { Tab, Tabs } from '@/components/tabs';
import { CodeBlock } from '@/components/ui/code-block';

interface CliInstallTabsProps {
  stepId: string;
}

export function CliInstallTabs({ stepId }: CliInstallTabsProps) {
  return (
    <Tabs items={['npm', 'pnpm', 'yarn', 'bun']}>
      <Tab value="npm">
        <CodeBlock>
          <pre>
            <code className="language-bash">
              {`npx shadcn@latest add @workflow/${stepId}`}
            </code>
          </pre>
        </CodeBlock>
      </Tab>
      <Tab value="pnpm">
        <CodeBlock>
          <pre>
            <code className="language-bash">
              {`pnpm dlx shadcn@latest add @workflow/${stepId}`}
            </code>
          </pre>
        </CodeBlock>
      </Tab>
      <Tab value="yarn">
        <CodeBlock>
          <pre>
            <code className="language-bash">
              {`yarn dlx shadcn@latest add @workflow/${stepId}`}
            </code>
          </pre>
        </CodeBlock>
      </Tab>
      <Tab value="bun">
        <CodeBlock>
          <pre>
            <code className="language-bash">
              {`bunx shadcn@latest add @workflow/${stepId}`}
            </code>
          </pre>
        </CodeBlock>
      </Tab>
    </Tabs>
  );
}
