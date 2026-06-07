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

assert.ok(
  fs.existsSync('src/components/Dashboard/dashboardData.ts'),
  'dashboardData.ts must exist'
);
const ddData = fs.readFileSync('src/components/Dashboard/dashboardData.ts', 'utf-8');
assert.ok(ddData.includes('getDashboardData'), 'must export getDashboardData');
assert.ok(ddData.includes('DashboardData'), 'must export DashboardData interface');
assert.ok(ddData.includes('DashboardTask'), 'must export DashboardTask interface');
assert.ok(ddData.includes('PeriodFinancials'), 'must export PeriodFinancials interface');

console.log('Task 3 PASS: dashboardData.ts created correctly.');

assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardGallery.tsx'),
  'DashboardGallery.tsx must exist'
);
const gallery = fs.readFileSync('src/components/Dashboard/DashboardGallery.tsx', 'utf-8');
assert.ok(gallery.includes('handleTouchStart'), 'gallery must handle touch start');
assert.ok(gallery.includes('handleTouchEnd'), 'gallery must handle touch end');
assert.ok(gallery.includes('useReducedMotion'), 'gallery must respect reduced motion');
assert.ok(gallery.includes("directionRef"), 'gallery must track slide direction');

console.log('Task 4 PASS: DashboardGallery created correctly.');

assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardDomainNav.tsx'),
  'DashboardDomainNav.tsx must exist'
);
const nav = fs.readFileSync('src/components/Dashboard/DashboardDomainNav.tsx', 'utf-8');
assert.ok(nav.includes("'today'"), "nav must include 'today' domain");
assert.ok(nav.includes("'financials'"), "nav must include 'financials' domain");
assert.ok(nav.includes("'tasks'"), "nav must include 'tasks' domain");
assert.ok(nav.includes('aria-pressed'), 'nav items must have aria-pressed');

console.log('Task 5 PASS: DashboardDomainNav created correctly.');

assert.ok(
  fs.existsSync('src/components/Dashboard/DashboardToday.tsx'),
  'DashboardToday.tsx must exist'
);
const today = fs.readFileSync('src/components/Dashboard/DashboardToday.tsx', 'utf-8');
assert.ok(today.includes('arrivalsToday'), 'must reference arrivalsToday');
assert.ok(today.includes('departuresToday'), 'must reference departuresToday');
assert.ok(today.includes('VIEW CALENDAR'), 'must include VIEW CALENDAR nav link');
assert.ok(today.includes('No arrivals'), 'must handle empty arrivals state');

console.log('Task 6 PASS: DashboardToday created correctly.');