const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('project page has responsive CSS and visible keyboard focus', () => {
  const css = fs.readFileSync(path.join(root, 'css', 'portfolio.css'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /href="css\/portfolio\.css"/);
  for (const token of [':focus-visible', 'prefers-reduced-motion', '@media', '.hero', '.feature', '.architecture-grid', '.block-diagram', '.diagram-track', '.diagram-lanes', '.diagram-pair']) {
    assert.ok(css.includes(token), `Missing ${token}`);
  }
});
