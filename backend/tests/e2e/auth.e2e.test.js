const request = require('supertest');
const app = require('../../app');
const { startTestDB, stopTestDB, clearTestDB } = require('../setup');

beforeAll(async () => {
    await startTestDB();
});

afterAll(async () => {
    await stopTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});

describe('E2E: Auth routes', () => {
    it('должен зарегистрировать нового пользователя', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ firstName: 'Test', secondName: 'Test', age: 25, city: 'Astana', email: 'test@example.com', password: '123456' });

        expect(res.statusCode).toBe(201);
    });

    it('должен вернуть ошибку при повторной регистрации с тем же email', async () => {
        await request(app)
            .post('/auth/register')
            .send({ firstName: 'Test', secondName: 'Test', age: 25, city: 'Astana', email: 'test@example.com', password: '123456' });

        const res = await request(app)
            .post('/auth/register')
            .send({ firstName: 'Test', secondName: 'Test', age: 25, city: 'Astana', email: 'test@example.com', password: '123456' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Пользователь с таким email уже существует');
    });

    it('должен войти с правильными данными', async () => {
        await request(app)
            .post('/auth/register')
            .send({ firstName: 'Test', secondName: 'Test', age: 25, city: 'Astana', email: 'test@example.com', password: '123456' });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '123456' });

        expect(res.statusCode).toBe(200);
    });

    it('должен вернуть ошибку при неправильном пароле', async () => {
        await request(app)
            .post('/auth/register')
            .send({ email: 'test@example.com', password: '123456' });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpass' });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Неверные email или пароль');
    });

    it('должен вернуть 401 если токен истёк', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Test', secondName: 'Test', age: 25,
                city: 'Astana', email: 'test@example.com', password: '123456'
            });

        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: '123456' });

        const token = loginRes.body.token;

        // ждём, чтобы токен истёк
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/токен истёк/i);
    });
});

