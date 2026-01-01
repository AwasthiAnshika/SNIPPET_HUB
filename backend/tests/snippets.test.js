const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const Snippet = require('../src/models/Snippet');
const User = require('../src/models/User');

describe('Snippets', ()=>{
  let userToken;
  let snippetId;
  beforeAll(async ()=>{
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/code_snippets_test');
    await Snippet.deleteMany({});
    await User.deleteMany({});
    const s = await Snippet.create({ title: 'search me', description: 'desc', language: 'javascript', tags: ['api'], code: 'console.log(1)' });
    snippetId = s._id.toString();
    const reg = await request(app).post('/api/auth/register').send({ name: 'T', email: `t${Date.now()}@ex.com`, password: 'password' });
    userToken = reg.body.token;
  });
  afterAll(async ()=>{ await mongoose.connection.close(); });

  test('public search', async ()=>{
    const res = await request(app).get('/api/snippets').query({ q: 'search' });
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  test('details', async ()=>{
    const res = await request(app).get(`/api/snippets/${snippetId}`);
    expect(res.body._id).toBeDefined();
  });

  test('rate requires auth', async ()=>{
    const res = await request(app).post(`/api/snippets/${snippetId}/rate`).send({ value: 5 });
    expect(res.status).toBe(401);
  });

  test('rate and update aggregates', async ()=>{
    const r = await request(app).post(`/api/snippets/${snippetId}/rate`).set('Authorization', `Bearer ${userToken}`).send({ value: 4 });
    expect(r.body.snippet.avgRating).toBeDefined();
    const r2 = await request(app).post(`/api/snippets/${snippetId}/rate`).set('Authorization', `Bearer ${userToken}`).send({ value: 5 });
    expect(r2.body.yourRating).toBe(5);
  });
});
