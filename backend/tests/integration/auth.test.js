const request = require('supertest');
const app = require('../../app');

const { startTestDB, stopTestDB, clearTestDB } = require('../setup');

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    await startTestDB(); // Запуск in-memory MongoDB
  });

  beforeEach(async () => {
    await clearTestDB(); // Очистка всех коллекций перед каждым тестом
  });

  afterAll(async () => {
    await stopTestDB(); // Отключение и остановка MongoDB
  });

  describe('POST /auth/register', () => {
    it('should register new user (201)', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Test',
          secondName: 'User',
          age: 25,
          city: 'Moscow',
          email: 'test@example.com',
          password: 'password123'
        });
      expect(response.status).toBe(201);
    });

    it('should reject duplicate email (400)', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Test',
          secondName: 'User',
          age: 25,
          city: 'Moscow',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Test',
          secondName: 'User',
          age: 25,
          city: 'Moscow',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error'); 
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Login',
          secondName: 'User',
          age: 25,
          city: 'Moscow',
          email: 'login@example.com',
          password: 'securepassword'
        });
    });

    it('should login with valid credentials (200)', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'securepassword'
        });

      expect(response.status).toBe(200);
    });

    it('should reject invalid password (401)', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });

    it('should reject non-existent email (401)', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword'
        });

      expect(response.status).toBe(401);
    });
  });
});
