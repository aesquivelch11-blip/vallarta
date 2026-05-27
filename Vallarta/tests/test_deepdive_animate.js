import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/FinancialDeepDiveView.tsx', 'utf-8');
assert.strictEqual(content.includes('animate-bounce'), false, 'FinancialDeepDiveView should not contain animate-bounce');
console.log('PASS: FinancialDeepDiveView motion is refined');
