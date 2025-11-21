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

/**
 * Replaces the code field in a metadata file with new code.
 * Uses manual string parsing instead of regex to handle escaped characters correctly.
 */
function replaceCodeField(content, newCode) {
  // Find the start of the code field
  const codeFieldStart = 'code: `';
  const startIndex = content.indexOf(codeFieldStart);

  if (startIndex === -1) {
    throw new Error('Could not find "code: `" in file');
  }

  // Start walking from after "code: `"
  let i = startIndex + codeFieldStart.length;
  let isEscaped = false;

  // Walk through the string, tracking escape sequences
  while (i < content.length) {
    const char = content[i];

    if (isEscaped) {
      // This character is escaped, skip it
      isEscaped = false;
    } else if (char === '\\') {
      // Next character will be escaped
      isEscaped = true;
    } else if (char === '`') {
      // Found an unescaped backtick - check if it's followed by comma
      if (content[i + 1] === ',') {
        // This is the end of the code field!
        // Escape the new code for template literal
        const escapedCode = newCode
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\$/g, '\\$');

        const beforeCode = content.substring(
          0,
          startIndex + codeFieldStart.length
        );
        const afterCode = content.substring(i); // includes `,

        return beforeCode + escapedCode + afterCode;
      }
    }

    i++;
  }

  throw new Error(
    'Could not find end of code field (backtick followed by comma)'
  );
}

// Inject step implementations
const stepFiles = fs
  .readdirSync(stepsDir)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

stepFiles.forEach((file) => {
  const implPath = path.join(implDir, file);
  const stepPath = path.join(stepsDir, file);

  if (!fs.existsSync(implPath)) return;

  const implCode = fs.readFileSync(implPath, 'utf-8');
  const stepContent = fs.readFileSync(stepPath, 'utf-8');

  try {
    const updatedContent = replaceCodeField(stepContent, implCode);
    fs.writeFileSync(stepPath, updatedContent);
    console.log(`✓ Injected ${file}`);
  } catch (error) {
    console.error(`✗ Failed to inject ${file}: ${error.message}`);
  }
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
  const workflowContent = fs.readFileSync(workflowPath, 'utf-8');

  try {
    const updatedContent = replaceCodeField(workflowContent, implCode);
    fs.writeFileSync(workflowPath, updatedContent);
    console.log(`✓ Injected ${file}`);
  } catch (error) {
    console.error(`✗ Failed to inject ${file}: ${error.message}`);
  }
});

console.log('\n✅ All implementations injected successfully!');
