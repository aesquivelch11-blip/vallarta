import fs from 'fs';
import assert from 'assert';

const views = ['FinancialReportingView.tsx', 'FinancialDeepDiveView.tsx', 'CameraFeedView.tsx'];
views.forEach(view => {
  const content = fs.readFileSync(`src/components/${view}`, 'utf-8');
  assert.strictEqual(content.includes('backdrop-blur-md'), false, `${view} should not contain backdrop-blur-md`);
});
console.log('PASS: Remaining views are clean');
