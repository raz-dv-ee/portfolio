const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

for (const name of ['caleyez-falafel.png', 'caleyez-sabich.png', 'caleyez-fries.png']) {
  test(`${name} is a genuine local PNG asset`, () => {
    const data = fs.readFileSync(path.join(root, 'images', name));
    assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.ok(data.length > 10_000);
  });
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('presents a project-led portfolio without employer or CV sections', () => {
  for (const phrase of ['CalEyeZ', 'Home camera system', 'MIPS processor', 'CMOS operational amplifier', 'Verilog TX/RX']) {
    assert.ok(html.includes(phrase), `Missing ${phrase}`);
  }
  for (const phrase of ['BEUMER', 'BHS Loop', 'id="experience"', 'id="skills"']) {
    assert.ok(!html.includes(phrase), `Unexpected ${phrase}`);
  }
});

test('separates documented evaluation samples', () => {
  assert.match(html, /86\.2%[\s\S]{0,180}held-out/i);
  assert.match(html, /40 of 47[\s\S]{0,180}own-photo/i);
});

test('each evidence image retains alt text and a caption', () => {
  const figures = [...html.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi)].map(match => match[0]);
  for (const name of ['falafel', 'sabich', 'fries']) {
    const figure = figures.find(markup => markup.includes(`src="images/caleyez-${name}.png"`));
    assert.ok(figure, `Missing ${name} figure`);
    assert.match(figure, /<img[^>]+alt="[^"]{20,}"/i);
    assert.match(figure, /<figcaption>/i);
  }
});

test('each project exposes a labelled architecture diagram with its key blocks', () => {
  const expected = new Map([
    ['CalEyeZ', ['Camera', 'BLE scale', 'XGBoost arbiter', 'Nutrition estimate']],
    ['Home camera system', ['IP cameras', 'Frigate', 'MQTT', 'Python event logic', 'SQLite']],
    ['MIPS processor', ['Instruction memory', 'Control decoder', 'Register file', 'Custom ALU operation', 'Write-back']],
    ['CMOS operational amplifier', ['Differential input pair', 'Second gain stage', 'Compensation network', 'Output load']],
    ['Verilog TX/RX', ['TX state machine', 'TX datapath', 'Transfer link', 'RX datapath', 'RX state machine']],
  ]);
  const diagrams = [...html.matchAll(/<figure class="block-diagram[^"]*"[^>]*aria-label="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/gi)];
  assert.equal(diagrams.length, expected.size);
  for (const [project, blocks] of expected) {
    const match = diagrams.find(([, label]) => label.includes(project));
    assert.ok(match, `Missing diagram for ${project}`);
    for (const block of blocks) assert.ok(match[2].includes(block), `Missing ${block} in ${project} diagram`);
  }
});

test('CalEyeZ food lookup follows the vision-and-mass merge, not the scale alone', () => {
  const diagram = html.match(/<figure class="block-diagram diagram-dark diagram-caleyez"[\s\S]*?<\/figure>/)?.[0];
  assert.ok(diagram);
  assert.ok(diagram.indexOf('Food reference') > diagram.indexOf('Vision result + mass'));
});

test('MIPS diagram separates control signals from register operands and memory bypass', () => {
  const diagram = html.match(/<figure class="block-diagram diagram-mips"[\s\S]*?<\/figure>/)?.[0];
  assert.ok(diagram);
  assert.ok(diagram.includes('Control signals to datapath'));
  assert.ok(diagram.includes('Data memory / bypass'));
});
