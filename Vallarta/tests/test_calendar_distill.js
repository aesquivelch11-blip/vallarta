import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/CalendarView.tsx', 'utf-8');
assert.strictEqual(content.includes('backdrop-blur-md'), false, 'CalendarView should not contain backdrop-blur-md');
assert.strictEqual(content.includes('border-l-4'), false, 'CalendarView should not contain side-borders');
console.log('PASS: CalendarView is clean');
