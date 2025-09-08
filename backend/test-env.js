import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== Environment Variable Test ===');
console.log('Current working directory:', process.cwd());
console.log('Script directory (__dirname):', __dirname);

// Check different .env locations
const envPaths = [
    join(__dirname, '.env'),
    join(process.cwd(), '.env'),
    '.env'
];

for (const envPath of envPaths) {
    console.log(`\nChecking: ${envPath}`);
    console.log('Exists:', fs.existsSync(envPath));
    if (fs.existsSync(envPath)) {
        console.log('Contents:', fs.readFileSync(envPath, 'utf8'));
    }
}

// Try loading from different paths
console.log('\n=== Testing dotenv.config() ===');

// Method 1: Default
const result1 = dotenv.config();
console.log('Default config result:', result1);
console.log('GEMINI_API_KEY after default:', process.env.GEMINI_API_KEY);

// Method 2: Explicit path
const result2 = dotenv.config({ path: join(__dirname, '.env') });
console.log('Explicit path result:', result2);
console.log('GEMINI_API_KEY after explicit:', process.env.GEMINI_API_KEY);

// Method 3: Override previous
delete process.env.GEMINI_API_KEY;
const result3 = dotenv.config({ path: join(__dirname, '.env'), override: true });
console.log('Override result:', result3);
console.log('GEMINI_API_KEY after override:', process.env.GEMINI_API_KEY);
