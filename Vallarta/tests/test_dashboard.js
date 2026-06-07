import fs from 'fs';
import assert from 'assert';

const types = fs.readFileSync('src/types.ts', 'utf-8');

assert.ok(types.includes("'dashboard'"), "ScreenType must include 'dashboard'");
assert.ok(types.includes('images'), 'Property must include images');

console.log('Task 1 PASS: types.ts extended correctly.');