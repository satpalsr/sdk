#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Store command-line flags
const flags = {};

// Main function to handle command execution
(async () => {
  const command = process.argv[2];
  
  // Parse command-line flags
  parseCommandLineFlags();
  
  // Execute the appropriate command
  const commandHandlers = {
    'init': init,
    'init-mcp': initMcp
  };
  
  const handler = commandHandlers[command];
  if (handler) {
    handler();
  } else {
    displayAvailableCommands(command);
  }
})();

/**
 * Parses command-line flags in the format --flag value
 */
function parseCommandLineFlags() {
  for (let i = 3; i < process.argv.length; i += 2) {
    if (i % 2 === 1) { // Odd indices are flags
      const flag = process.argv[i].replace('--', '');
      const value = process.argv[i + 1];
      flags[flag] = value;
    }
  }
}

/**
 * Displays available commands when an unknown command is entered
 */
function displayAvailableCommands(command) {
  console.log('Unknown command: ' + command);
  console.log('Supported commands: init, init-mcp');
}

/**
 * Creates a readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Init command
 * 
 * Initializes a new HYTOPIA project. Accepting an optional
 * project name as an argument.
 * 
 * @example
 * `bunx hytopia init my-project-name`
 */
function init() {
  const destDir = process.cwd();

  // Install dependencies
  installProjectDependencies();

  // Initialize project with latest HYTOPIA SDK
  console.log('🔧 Initializing project with latest HYTOPIA SDK...');
 
  if (flags.template) {
    initFromTemplate(destDir);
  } else {
    initFromBoilerplate(destDir);
  }

  // Copy assets into project, not overwriting existing files
  copyAssets(destDir);

  // Display success message
  displayInitSuccessMessage();

  // Prompt for MCP setup
  promptForMcpSetup();

  return;
}

/**
 * Installs required dependencies for a new project
 */
function installProjectDependencies() {
  execSync('bun init --yes');
  execSync('bun add hytopia@latest --force');
  execSync('bun add @hytopia.com/assets --force');
}

/**
 * Initializes a project from a template
 */
function initFromTemplate(destDir) {
  console.log(`🖨️  Initializing project with examples template "${flags.template}"...`);

  const templateDir = path.join(destDir, 'node_modules', 'hytopia', 'examples', flags.template);

  if (!fs.existsSync(templateDir)) {
    console.error(`❌ Examples template ${flags.template} does not exist in the examples directory, could not initialize project!`);
    console.error(`   Tried directory: ${templateDir}`);
    return;
  }

  fs.cpSync(templateDir, destDir, { recursive: true });
  execSync('bun install');
}

/**
 * Initializes a project from the default boilerplate
 */
function initFromBoilerplate(destDir) {
  console.log('🧑‍💻 Initializing project with boilerplate...');
  const srcDir = path.join(__dirname, '..', 'boilerplate');
  fs.cpSync(srcDir, destDir, { recursive: true });  
}

/**
 * Copies assets to the project directory
 */
function copyAssets(destDir) {
  fs.cpSync(
    path.join(destDir, 'node_modules', '@hytopia.com', 'assets'),
    path.join(destDir, 'assets'),
    { recursive: true, force: false }
  );
}

/**
 * Displays success message after project initialization
 */
function displayInitSuccessMessage() {
  logDivider();
  console.log('✅ HYTOPIA PROJECT INITIALIZED SUCCESSFULLY!');
  console.log(' ');
  console.log('💡 1. Start your development server with: bun --watch index.ts');
  console.log('🎮 2. Play your game by opening: https://play.hytopia.com/?join=localhost:8080');
  logDivider();
}

/**
 * Prompts the user to set up MCP
 */
function promptForMcpSetup() {
  console.log('📋 OPTIONAL: HYTOPIA MCP SETUP');
  console.log(' ');
  console.log('The HYTOPIA MCP enables Cursor and Claude Code editors to access');
  console.log('HYTOPIA-specific capabilities, providing significantly better AI');
  console.log('assistance and development experience for this HYTOPIA project.');
  console.log(' ');

  const rl = createReadlineInterface();
  
  rl.question('Would you like to initialize the HYTOPIA MCP for this project? (y/n): ', (answer) => {
    rl.close();

    if (answer.trim().toLowerCase() === 'y') {
      initMcp();
    } else {
      logDivider();
      console.log('🎉 You\'re all set! Your HYTOPIA project is ready to use.');
      logDivider();
    }
  });
}

/**
 * Initializes the MCP for the selected editors
 */
function initMcp() {
  const rl = createReadlineInterface();

  logDivider();
  console.log('🤖 HYTOPIA MCP SETUP');
  console.log('Please select your code editor:');
  console.log('  1. Cursor');
  console.log('  2. Claude Code');
  console.log('  3. Both');
  console.log('  4. None / Cancel');

  rl.question('Enter your selection (1-4): ', (answer) => {
    const selection = parseInt(answer.trim());
    
    if (isNaN(selection) || selection < 1 || selection > 4) {
      console.log('❌ Invalid selection. Please run `bunx hytopia init-mcp` again and select a number between 1 and 4.');
      rl.close();
      return;
    }
    
    if ([1, 2, 3].includes(selection)) { logDivider(); }

    if (selection === 1 || selection === 3) {
      initEditorMcp('Cursor', 'cursor');
    }

    if (selection === 2 || selection === 3) {
      initEditorMcp('Claude Code', 'claude');
    }
    
    rl.close();
    
    if ([1, 2, 3].includes(selection)) {
      console.log('🎉 You\'re all set! Your HYTOPIA project is ready to use.');
      logDivider();
    }
  });
}

/**
 * Initializes MCP for a specific editor
 */
function initEditorMcp(editorName, editorFlag) {
  console.log(`🔧 Initializing HYTOPIA MCP for ${editorName}...`);
  execSync(`bunx topia-mcp@latest init ${editorFlag}`);
  console.log(`✅ ${editorName} MCP initialized successfully!`);
  logDivider();
}

/**
 * Prints a divider line for better console output readability
 */
function logDivider() {
  console.log('--------------------------------');
}