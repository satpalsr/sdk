#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkcert = require('mkcert');

(async () => {
  const command = process.argv[2];

  if (command === 'init') {
    const srcDir = path.join(__dirname, '..', 'boilerplate');
    const destDir = process.cwd();
  
    // Copy boilerplate
    console.log(`Copying boilerplate to ${destDir}`);
    fs.cpSync(srcDir, destDir, { recursive: true });
  
    // Generate SSL cert and allow mkcert to auto handle CA/Cert setup
    console.log(`Generating SSL cert for local development...`);
    const validity = 3650; // 10 years
    const ca = await mkcert.createCA({
      organization: 'HYTOPIA',
      countryCode: 'US',
      state: 'Washington',
      locality: 'Seattle',
      validity,
    });

    const cert = await mkcert.createCert({
      ca: { key: ca.key, cert: ca.cert },
      domains: ['localhost', '127.0.0.1'],
      validity,
    });

    fs.writeFileSync(path.join(destDir, 'assets', 'certs', 'localhost.crt'), cert.cert);
    fs.writeFileSync(path.join(destDir, 'assets', 'certs', 'localhost.key'), cert.key);

    // Done, lfg!
    console.log('🚀 Hytopia project initialized successfully!');
    console.log('💡 Start your development server with `bun --watch index.ts`!');
    return;
  }
  
  console.log('Unknown command: ' + command);
})();

