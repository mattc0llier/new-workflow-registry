// Type definitions for Workflow Elements

export type Step = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'Core' | 'AI' | 'Data' | 'Communication' | 'Payment' | 'Storage';
  integration?: string; // Optional integration ID
  tags: string[];
  code: string;
  envVars?: {
    name: string;
    description: string;
    required: boolean;
  }[];
  dependencies?: string[];
  usedInWorkflows?: string[]; // Array of workflow IDs
};

export type Integration = {
  id: string;
  name: string;
  description: string;
  icon: string;
  domain: string; // Domain for logo.dev (e.g., 'slack.com')
  website?: string;
  docsUrl?: string;
  steps: string[]; // Array of step IDs
  setupInstructions?: string;
  authType?: 'API Key' | 'OAuth' | 'Basic Auth' | 'None';
  category: 'Core' | 'AI' | 'Data' | 'Communication' | 'Payment' | 'Storage';
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: {
    stepId: string;
    order: number;
    description: string;
  }[];
  code: string;
  useCase: string;
  prerequisites?: string[];
};
