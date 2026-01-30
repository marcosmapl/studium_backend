/**
 * Script para criar arquivo .env com timestamp de build
 * Executar antes do build: node scripts/generate-build-info.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Obtém o hash do último commit (se disponível)
let commitHash = 'unknown';
try {
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
} catch (error) {
    console.warn('Git não disponível ou não é um repositório git');
}

// Obtém timestamp atual
const buildTimestamp = new Date().toISOString();

// Lê o .env existente (se houver)
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');

    // Remove linhas antigas de build info
    envContent = envContent
        .split('\n')
        .filter(line => !line.startsWith('VITE_BUILD_TIMESTAMP=') && !line.startsWith('VITE_COMMIT_HASH='))
        .join('\n');
}

// Adiciona novas informações de build
const buildInfo = `
# Build Info (gerado automaticamente)
VITE_BUILD_TIMESTAMP=${buildTimestamp}
VITE_COMMIT_HASH=${commitHash}
`;

envContent = envContent.trim() + '\n' + buildInfo;

// Salva o arquivo .env
fs.writeFileSync(envPath, envContent);

console.log('✅ Build info gerado com sucesso!');
console.log(`   Timestamp: ${buildTimestamp}`);
console.log(`   Commit: ${commitHash.substring(0, 10)}...`);
