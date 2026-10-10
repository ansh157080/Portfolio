const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { app } = require('../server');
const { pool } = require('../src/config/db');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    // Start on ephemeral port for tests
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await pool.end();
});

test('GET /api/health returns 200 with database status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert.ok(data.database);
  assert.strictEqual(data.database.status, 'connected');
});

test('GET /api/projects returns seeded portfolio projects in correct order', async () => {
  const res = await fetch(`${baseUrl}/api/projects`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.strictEqual(json.data.length, 2);

  // Mausam should be first
  assert.ok(json.data[0].title.includes('Mausam'));

  // Suraksha Kawach should be second
  assert.ok(json.data[1].title.includes('Suraksha Kawach'));
  assert.strictEqual(json.data[1].demo_url, '');

  // Crime Record should be completely removed
  const titles = json.data.map(p => p.title);
  assert.ok(!titles.some(t => t.includes('Crime Record')));
});


test('GET /api/projects?category=AI / Machine Learning filters correctly', async () => {
  const res = await fetch(`${baseUrl}/api/projects?category=AI / Machine Learning`);
  assert.strictEqual(res.status, 200);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.ok(json.data.length >= 1);
  assert.ok(json.data.every(p => p.category.includes('AI') || p.category.includes('Machine Learning')));
});

test('POST /api/contact validates missing fields and rejects invalid email', async () => {
  const badRes = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', email: 'not-an-email', subject: 'hi', message: 'no' })
  });

  assert.strictEqual(badRes.status, 400);
  const json = await badRes.json();
  assert.strictEqual(json.success, false);
  assert.ok(json.errors.length > 0);
});

test('POST /api/contact saves valid submission into MySQL database', async () => {
  const testPayload = {
    name: 'Internship Recruiter',
    email: 'recruiter@thiranex.com',
    subject: 'Interview Invitation for Anshu Thakur',
    message: 'Hello Anshu, your portfolio is outstanding. We would love to discuss an internship role!'
  };

  const res = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  assert.strictEqual(res.status, 201);
  const json = await res.json();
  assert.strictEqual(json.success, true);
  assert.ok(json.data.id > 0);

  // Verify it exists in GET /api/contact
  const listRes = await fetch(`${baseUrl}/api/contact`);
  assert.strictEqual(listRes.status, 200);
  const listJson = await listRes.json();
  assert.ok(listJson.data.some(c => c.email === 'recruiter@thiranex.com'));
});
