import fs from 'fs';
import assert from 'assert';

const types = fs.readFileSync('src/types.ts', 'utf-8');

assert.ok(types.includes("'dashboard'"), "ScreenType must include 'dashboard'");
assert.ok(types.includes('images'), 'Property must include images');

console.log('Task 1 PASS: types.ts extended correctly.');

const propData = fs.readFileSync('src/components/PropertySelector/propertyData.ts', 'utf-8');
assert.ok(propData.includes('images:'), 'propertyData must include images array');
assert.ok(propData.includes('[propImg1'), 'images array must reference propImg1');

console.log('Task 2 PASS: property data includes images.');