const fs = require('fs');
const path = require('path');

// Import the steps data from the compiled structure
// Since this is a Node script, we need to dynamically import the TypeScript
const stepsDir = path.join(process.cwd(), 'lib', 'step-implementations');

console.log('🔨 Building workflow registry...\n');

// Read all step files from the step-implementations directory
const stepFiles = fs
  .readdirSync(stepsDir)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts');

console.log(`Found ${stepFiles.length} steps to process`);

// Create public/r directory
const registryDir = path.join(process.cwd(), 'public', 'r');
fs.mkdirSync(registryDir, { recursive: true });

const registryItems = [];

// For each step file, extract key information
stepFiles.forEach((file) => {
  const stepPath = path.join(stepsDir, file);
  const stepContent = fs.readFileSync(stepPath, 'utf-8');

  // Extract the step ID from the filename
  const id = file.replace('.ts', '');

  // Read the metadata from the steps directory
  const metadataPath = path.join(process.cwd(), 'lib', 'steps', file);
  const metadataContent = fs.readFileSync(metadataPath, 'utf-8');

  // Extract metadata fields
  const nameMatch = metadataContent.match(/name: '([^']+)'/);
  const descMatch = metadataContent.match(/description:\s*'([^']+)'/);
  const depsMatch = metadataContent.match(/dependencies: \[([\s\S]*?)\]/);

  if (!nameMatch || !descMatch) {
    console.log(`⚠️  Skipping ${file} - missing required fields`);
    return;
  }

  const name = nameMatch[1];
  const description = descMatch[1];

  // Extract dependencies
  let dependencies = [];
  if (depsMatch) {
    dependencies = depsMatch[1]
      .split(',')
      .map((d) => d.trim().replace(/['"`]/g, ''))
      .filter((d) => d.length > 0);
  }

  console.log(`📦 Generating registry for: ${id}`);

  const registryItem = {
    name: id,
    type: 'registry:block',
    title: name,
    description: description,
    registryDependencies: [],
    dependencies: dependencies,
    files: [
      {
        path: `registry/steps/${id}.tsx`,
        type: 'registry:component',
        content: stepContent,
        target: `components/steps/${id}.tsx`,
      },
    ],
  };

  // Write individual step registry file
  const itemPath = path.join(registryDir, `${id}.json`);
  fs.writeFileSync(itemPath, JSON.stringify(registryItem, null, 2));

  // Add to main registry items list
  registryItems.push({
    name: id,
    type: 'registry:block',
    title: name,
    description: description,
  });
});

// Process workflow files
console.log(`\nFound ${stepFiles.length} steps processed`);

const workflowImplDir = path.join(
  process.cwd(),
  'lib',
  'workflow-implementations'
);
const workflowFiles = fs
  .readdirSync(workflowImplDir)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts');

console.log(`\nFound ${workflowFiles.length} workflows to process`);

workflowFiles.forEach((file) => {
  const workflowPath = path.join(workflowImplDir, file);
  const workflowContent = fs.readFileSync(workflowPath, 'utf-8');

  // Extract the workflow ID from the filename
  const id = file.replace('.ts', '');

  // Read the metadata from the workflows directory
  const metadataPath = path.join(process.cwd(), 'lib', 'workflows', file);
  const metadataContent = fs.readFileSync(metadataPath, 'utf-8');

  // Extract metadata fields
  const nameMatch = metadataContent.match(/name: '([^']+)'/);
  const descMatch = metadataContent.match(/description:\s*'([^']+)'/);
  const depsMatch = metadataContent.match(/dependencies: \[([\s\S]*?)\]/);

  if (!nameMatch || !descMatch) {
    console.log(`⚠️  Skipping ${file} - missing required fields`);
    return;
  }

  const name = nameMatch[1];
  const description = descMatch[1];

  // Extract dependencies
  let dependencies = [];
  if (depsMatch) {
    dependencies = depsMatch[1]
      .split(',')
      .map((d) => d.trim().replace(/['"`]/g, ''))
      .filter((d) => d.length > 0);
  }

  console.log(`🔄 Generating registry for workflow: ${id}`);

  const registryItem = {
    name: id,
    type: 'registry:block',
    title: name,
    description: description,
    registryDependencies: [],
    dependencies: dependencies,
    files: [
      {
        path: `registry/workflows/${id}.tsx`,
        type: 'registry:component',
        content: workflowContent,
        target: `components/workflows/${id}.tsx`,
      },
    ],
  };

  // Write individual workflow registry file
  const itemPath = path.join(registryDir, `${id}.json`);
  fs.writeFileSync(itemPath, JSON.stringify(registryItem, null, 2));

  // Add to main registry items list
  registryItems.push({
    name: id,
    type: 'registry:block',
    title: name,
    description: description,
  });
});

// Generate main registry.json
const mainRegistry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'workflow-elements',
  homepage: 'https://workflow-registry.vercel.app',
  items: registryItems,
};

const registryPath = path.join(registryDir, 'registry.json');
fs.writeFileSync(registryPath, JSON.stringify(mainRegistry, null, 2));

console.log(
  `\n✅ Successfully generated ${registryItems.length} registry items (${stepFiles.length} steps + ${workflowFiles.length} workflows)`
);
console.log(`📁 Registry files written to: public/r/`);
console.log(`\n📋 Main registry: public/r/registry.json`);
console.log(`\nUsers can now install steps and workflows via:`);
console.log(`  npx shadcn@latest add @workflow/send-slack-message`);
console.log(`  npx shadcn@latest add @workflow/slackbot-agent`);
