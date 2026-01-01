const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('Auth', ()=>{
  beforeAll(async ()=>{
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
  });
  afterAll(async ()=>{ await mongoose.connection.close(); });

  test('register and login', async ()=>{
    const email = `test${Date.now()}@example.com`;
    const res = await request(app).post('/api/auth/register').send({ name: 'T', email, password: 'password' });
    expect(res.body.token).toBeDefined();
    const login = await request(app).post('/api/auth/login').send({ email, password: 'password' });
    expect(login.body.token).toBeDefined();
  });
});
