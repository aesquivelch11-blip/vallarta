import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/LoginView.tsx', 'utf-8');
assert.strictEqual(content.includes('backdrop-blur-md'), false, 'LoginView should not contain backdrop-blur-md');
assert.strictEqual(content.includes('bg-gradient-to-r'), false, 'LoginView should not contain bg-gradient-to-r');
console.log('PASS: LoginView is clean');
