const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function meta(property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<meta\\s+property="${escaped}"\\s+content="([^"]+)"`, 'i'));
  return match?.[1] ?? '';
}

test('publishes a descriptive Open Graph preview for LinkedIn', () => {
  assert.ok(meta('og:title').length >= 15);
  assert.ok(meta('og:description').length >= 100);
  assert.equal(meta('og:type'), 'website');
  assert.equal(meta('og:url'), 'https://raz-dv-ee.github.io/portfolio/');
  assert.equal(meta('og:image'), 'https://raz-dv-ee.github.io/portfolio/images/RAZ.JPG');
  assert.ok(fs.existsSync(path.join(root, 'images', 'RAZ.JPG')));
});
