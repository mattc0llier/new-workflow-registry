import fs from 'fs';
import path from 'path';
import type { Step } from '../elements-types';

const code = fs.readFileSync(
  path.join(__dirname, '../step-implementations/http-request.ts'),
  'utf-8'
);

export const httpRequest: Step = {
  id: 'http-request',
  name: 'HTTP Request',
  description: 'Make HTTP requests to any API endpoint',
  icon: 'Globe',
  category: 'Core',
  tags: ['http', 'api', 'rest'],
  code,
  dependencies: ['@vercel/workflow'],
};
