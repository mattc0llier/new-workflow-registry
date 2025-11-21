const fs = require('fs');
const path = require('path');

console.log('🔍 Validating step implementations...\n');

const stepsDir = path.join(process.cwd(), 'lib', 'step-implementations');
const stepFiles = fs
  .readdirSync(stepsDir)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts');

console.log(`Found ${stepFiles.length} step files to validate\n`);

let hasErrors = false;
const errors = [];
const warnings = [];

// Required patterns that every step implementation should have
const requiredPatterns = [
  {
    name: '"use step" directive',
    pattern: /['"]use step['"]/,
    required: true,
  },
  {
    name: 'export async function',
    pattern: /export\s+async\s+function\s+\w+/,
    required: true,
  },
  {
    name: 'FatalError import',
    pattern:
      /import\s+.*\{[^}]*FatalError[^}]*\}\s+from\s+['"]@vercel\/workflow['"]/,
    required: true,
  },
  {
    name: 'FatalError usage',
    pattern: /throw\s+new\s+FatalError\(/,
    required: true,
  },
  {
    name: 'Environment variable check',
    pattern: /process\.env\.\w+/,
    required: true,
  },
];

// Check for common issues
const issueChecks = [
  {
    name: 'Missing API key validation',
    pattern: /if\s*\(\s*!.*process\.env\.\w+/,
    warning: true,
  },
  {
    name: 'API fetch call',
    pattern: /await\s+fetch\(/,
    warning: true,
  },
  {
    name: 'Response error handling',
    pattern: /if\s*\(\s*!.*\.ok\s*\)/,
    warning: true,
  },
];

stepFiles.forEach((file) => {
  const stepPath = path.join(stepsDir, file);
  const stepContent = fs.readFileSync(stepPath, 'utf-8');
  const stepErrors = [];
  const stepWarnings = [];

  // Check required patterns
  requiredPatterns.forEach(({ name, pattern }) => {
    if (!pattern.test(stepContent)) {
      stepErrors.push(`Missing ${name}`);
    }
  });

  // Check for common issues
  issueChecks.forEach(({ name, pattern, warning }) => {
    if (!pattern.test(stepContent)) {
      stepWarnings.push(`Possibly missing ${name}`);
    }
  });

  // Additional validations

  // Check if function name matches file name
  const fileNameBase = file.replace('.ts', '');
  const functionNamePattern = new RegExp(
    `export\\s+async\\s+function\\s+${fileNameBase}\\s*\\(`
  );
  if (!functionNamePattern.test(stepContent)) {
    stepWarnings.push(`Function name should match file name: ${fileNameBase}`);
  }

  // Check for type definitions
  if (!stepContent.includes('type ') && !stepContent.includes('interface ')) {
    stepWarnings.push('No parameter type definition found');
  }

  // Report results for this file
  if (stepErrors.length > 0 || stepWarnings.length > 0) {
    console.log(`\n📄 ${file}`);

    if (stepErrors.length > 0) {
      hasErrors = true;
      stepErrors.forEach((error) => {
        console.error(`  ❌ ${error}`);
        errors.push({ file, error });
      });
    }

    if (stepWarnings.length > 0) {
      stepWarnings.forEach((warning) => {
        console.warn(`  ⚠️  ${warning}`);
        warnings.push({ file, warning });
      });
    }
  } else {
    console.log(`✅ ${file}`);
  }
});

// Print summary
console.log('\n' + '='.repeat(60));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`\nTotal files validated: ${stepFiles.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.log('\n❌ ERRORS FOUND:');
  errors.forEach(({ file, error }) => {
    console.error(`  - ${file}: ${error}`);
  });
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(({ file, warning }) => {
    console.warn(`  - ${file}: ${warning}`);
  });
}

if (hasErrors) {
  console.error('\n❌ Step validation failed. Please fix the errors above.');
  process.exit(1);
}

console.log('\n✅ All step implementations validated successfully!');

// Additional check: Verify corresponding metadata files exist
console.log('\n🔍 Checking metadata files...');
const metadataDir = path.join(process.cwd(), 'lib', 'steps');
let metadataErrors = false;

stepFiles.forEach((file) => {
  const metadataPath = path.join(metadataDir, file);
  if (!fs.existsSync(metadataPath)) {
    console.error(`❌ Missing metadata file for ${file}`);
    metadataErrors = true;
  }
});

if (metadataErrors) {
  console.error('\n❌ Some metadata files are missing.');
  process.exit(1);
}

console.log('✅ All metadata files present.');
console.log('\n🎉 Validation complete!\n');
