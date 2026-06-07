import fs from 'fs';
import assert from 'assert';

// Test PropertySelector component exists with required exports
const selectorContent = fs.readFileSync('src/components/PropertySelector/PropertySelector.tsx', 'utf-8');
assert.ok(selectorContent.includes('export default function PropertySelector'), 'PropertySelector should be default exported');
assert.ok(selectorContent.includes('isContentOpen'), 'PropertySelector should have isContentOpen state');

// Test Property interface in types.ts
const typesContent = fs.readFileSync('src/types.ts', 'utf-8');
assert.ok(typesContent.includes("property_selector"), 'ScreenType should include property_selector');
assert.ok(typesContent.includes('interface Property'), 'types.ts should export Property interface');

// Test sample data exists
const dataContent = fs.readFileSync('src/components/PropertySelector/propertyData.ts', 'utf-8');
assert.ok(dataContent.includes('sampleProperties'), 'propertyData should export sampleProperties');
assert.ok(dataContent.includes('casa-palmeras'), 'sampleProperties should include casa-palmeras');

// Test DiagonalSlide exists
assert.ok(fs.existsSync('src/components/PropertySelector/DiagonalSlide.tsx'), 'DiagonalSlide component should exist');

// Test SlideshowPagination exists
assert.ok(fs.existsSync('src/components/PropertySelector/SlideshowPagination.tsx'), 'SlideshowPagination component should exist');

// Test PropertyContent exists  
assert.ok(fs.existsSync('src/components/PropertySelector/PropertyContent.tsx'), 'PropertyContent component should exist');

// Test NavMenuView routes to property_selector
const navContent = fs.readFileSync('src/components/NavMenuView.tsx', 'utf-8');
assert.ok(navContent.includes('property_selector'), 'NavMenuView should have a menu item routing to property_selector');

// Test keyboard nav support
assert.ok(selectorContent.includes('ArrowLeft'), 'PropertySelector should support ArrowLeft keyboard navigation');
assert.ok(selectorContent.includes('ArrowRight'), 'PropertySelector should support ArrowRight keyboard navigation');

// Test touch swipe support
assert.ok(selectorContent.includes('handleTouchStart'), 'PropertySelector should handle touch start');
assert.ok(selectorContent.includes('handleTouchEnd'), 'PropertySelector should handle touch end');

// Test reduced motion support
assert.ok(selectorContent.includes('useReducedMotion'), 'PropertySelector should use useReducedMotion hook');

console.log('PASS: All property selector tests passed.');
