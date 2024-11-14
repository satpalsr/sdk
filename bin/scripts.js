#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const command = process.argv[2];

  /**
   * Init command
   * 
   * Initializes a new HYTOPIA project. Accepting an optional
   * project name as an argument.
   * 
   * @example
   * `bunx hytopia init my-project-name`
   */
  if (command === 'init') {
    const srcDir = path.join(__dirname, '..', 'boilerplate');
    const destDir = process.cwd();
 
    // Initialize project
    execSync('bun init --yes');
    execSync('bun add hytopia');

    // Copy boilerplate
    console.log(`🖨️ Copying boilerplate to ${destDir}`);
    fs.cpSync(srcDir, destDir, { recursive: true });

    // Done, lfg!
    console.log('🚀 Hytopia project initialized successfully!');
    console.log('💡 Start your development server with `bun --watch index.ts`!');
    return;
  }
  
  console.log('Unknown command: ' + command);
})();

