const fs = require('fs');
const path = require('path');

// Import the steps data from the compiled structure
// Since this is a Node script, we need to dynamically import the TypeScript
const stepsDir = path.join(process.cwd(), 'lib', 'steps');

console.log('🔨 Building workflow registry...\n');

// Read all step files from the steps directory
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
  const stepContent = fs.readFileSync(stepPath, 'utf8');

  // Extract id
  const idMatch = stepContent.match(/id: '([^']+)'/);
  const nameMatch = stepContent.match(/name: '([^']+)'/);
  const descMatch = stepContent.match(/description:\s*'([^']+)'/);
  const codeMatch = stepContent.match(
    /code: `([\s\S]*?)`(?=,\s*(?:envVars|dependencies))/
  );
  const depsMatch = stepContent.match(/dependencies: \[([\s\S]*?)\]/);

  if (!idMatch || !nameMatch || !descMatch || !codeMatch) {
    console.log(`⚠️  Skipping ${file} - missing required fields`);
    return;
  }

  const id = idMatch[1];
  const name = nameMatch[1];
  const description = descMatch[1];
  const code = codeMatch[1];

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
        content: code,
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
  `\n✅ Successfully generated ${registryItems.length} registry items`
);
console.log(`📁 Registry files written to: public/r/`);
console.log(`\n📋 Main registry: public/r/registry.json`);
console.log(`\nUsers can now install steps via:`);
console.log(`  npx shadcn@latest add @workflow/send-slack-message`);
console.log(`  npx shadcn@latest add @workflow/openai-chat`);
