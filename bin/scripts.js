#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const command = process.argv[2];

if (command === 'init') {
  const srcDir = path.join(__dirname, '..', 'boilerplate');
  const destDir = process.cwd();

  fs.cpSync(srcDir, destDir, { recursive: true });

  console.log('🚀 Hytopia project initialized successfully!');
  console.log('💡 Start your development server with `bun --watch index.ts`!');
  return;
}

console.log('Unknown command: ' + command);