import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/LoginView.tsx', 'utf-8');
assert.strictEqual(content.includes('bg-black'), false, 'LoginView should not contain bg-black');
console.log('PASS: LoginView colorization is correct');
