import fs from 'fs';
import assert from 'assert';

const views = ['CameraFeedView.tsx', 'FinancialReportingView.tsx'];
views.forEach(view => {
  const content = fs.readFileSync(`src/components/${view}`, 'utf-8');
  assert.strictEqual(content.includes('bg-black'), false, `${view} should not contain bg-black`);
});
console.log('PASS: Views colorization is correct');
