const fs = require('fs');
const path = require('path');

console.log('🔧 Injecting step implementations...\n');

const stepsDir = path.join(process.cwd(), 'lib', 'steps');
const implDir = path.join(process.cwd(), 'lib', 'step-implementations');
const workflowsDir = path.join(process.cwd(), 'lib', 'workflows');
const workflowImplDir = path.join(
  process.cwd(),
  'lib',
  'workflow-implementations'
);

// Inject step implementations
const stepFiles = fs
  .readdirSync(stepsDir)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

stepFiles.forEach((file) => {
  const implPath = path.join(implDir, file);
  const stepPath = path.join(stepsDir, file);

  if (!fs.existsSync(implPath)) return;

  const implCode = fs.readFileSync(implPath, 'utf-8');
  let stepContent = fs.readFileSync(stepPath, 'utf-8');

  // Escape backticks and dollar signs in the implementation code
  const escapedCode = implCode
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  // Replace the empty code with the implementation
  stepContent = stepContent.replace(
    /code: '',\s*\/\/ Injected at build time/,
    `code: \`${escapedCode}\`,`
  );

  fs.writeFileSync(stepPath, stepContent);
  console.log(`✓ Injected ${file}`);
});

// Inject workflow implementations
const workflowFiles = fs
  .readdirSync(workflowsDir)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

workflowFiles.forEach((file) => {
  const implPath = path.join(workflowImplDir, file);
  const workflowPath = path.join(workflowsDir, file);

  if (!fs.existsSync(implPath)) return;

  const implCode = fs.readFileSync(implPath, 'utf-8');
  let workflowContent = fs.readFileSync(workflowPath, 'utf-8');

  // Escape backticks and dollar signs in the implementation code
  const escapedCode = implCode
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  // Replace the empty code with the implementation
  workflowContent = workflowContent.replace(
    /code: '',\s*\/\/ Injected at build time/,
    `code: \`${escapedCode}\`,`
  );

  fs.writeFileSync(workflowPath, workflowContent);
  console.log(`✓ Injected ${file}`);
});

console.log('\n✅ All implementations injected successfully!');
