import fs from 'fs';
import assert from 'assert';

const paginationContent = fs.readFileSync('src/components/PropertySelector/SlideshowPagination.tsx', 'utf-8');
assert.ok(paginationContent.includes('role="tablist"'), 'Pagination should have role="tablist"');
assert.ok(paginationContent.includes('role="tab"'), 'Pagination dots should have role="tab"');
assert.ok(paginationContent.includes('aria-selected'), 'Pagination dots should have aria-selected');

const overlayContent = fs.readFileSync('src/components/PropertySelector/PropertyContent.tsx', 'utf-8');
assert.ok(overlayContent.includes('role="dialog"'), 'PropertyContent should have role="dialog"');
assert.ok(overlayContent.includes('aria-modal="true"'), 'PropertyContent should have aria-modal="true"');
assert.ok(overlayContent.includes('aria-label="Property details"'), 'PropertyContent should have correct aria-label');

const selectorContent = fs.readFileSync('src/components/PropertySelector/PropertySelector.tsx', 'utf-8');
assert.ok(selectorContent.includes('aria-live="polite"'), 'PropertySelector should have aria-live region');
assert.ok(selectorContent.includes('aria-label'), 'PropertySelector should have aria-labels on slides');

const diagonalContent = fs.readFileSync('src/components/PropertySelector/DiagonalSlide.tsx', 'utf-8');
assert.ok(diagonalContent.includes('<picture'), 'DiagonalSlide should use picture element');

console.log('PASS: All ARIA tests passed.');
