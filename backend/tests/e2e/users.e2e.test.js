const request = require('supertest');
const app = require('../../app');
const { startTestDB, stopTestDB, clearTestDB } = require('../setup');

let token;
let userId;

beforeAll(async () => {
    await startTestDB();
});

afterAll(async () => {
    await stopTestDB();
});

beforeEach(async () => {
    await clearTestDB();
    // Регистрируем пользователя и получаем токен
    await request(app)
        .post('/auth/register')
        .send({
            firstName: 'Test',
            secondName: 'User',
            age: 30,
            city: 'Almaty',
            email: 'user@example.com',
            password: 'password123'
        });

    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'password123' });

    token = res.body.token;
});

const getToken = async () => {
    const email = 'test@example.com';
    const password = '123456';

    await request(app).post('/auth/register').send({
        firstName: 'Test',
        secondName: 'Test',
        age: 30,
        city: 'Almaty',
        email,
        password
    });

    const res = await request(app).post('/auth/login').send({ email, password });
    return res.body.token;
};


describe('E2E: Users routes', () => {
    it('должен создать нового пользователя', async () => {
        const res = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'John',
                secondName: 'Doe',
                age: 25,
                city: 'Astana',
                email: 'john@example.com',
                password: 'password456'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        userId = res.body.id;
    });

    it('должен получить всех пользователей', async () => {
        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('users');
        expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('должен получить пользователя по ID', async () => {
        const userRes = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Jane',
                secondName: 'Doe',
                age: 22,
                city: 'Karaganda',
                email: 'jane@example.com',
                password: 'password789'
            });

        const id = userRes.body.id;

        const res = await request(app)
            .get(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe('jane@example.com');
    });

    it('должен обновить пользователя', async () => {
        const createRes = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Max',
                secondName: 'Payne',
                age: 35,
                city: 'Semey',
                email: 'max@example.com',
                password: 'maxpass'
            });

        const id = createRes.body.id;

        const updateRes = await request(app)
            .put(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Max',
                secondName: 'Payne',
                age: 36,
                city: 'Shymkent',
                email: 'max@example.com',
                password: 'maxpass'
            });

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body).toHaveProperty('user');
        expect(updateRes.body.user.city).toBe('Shymkent');
    });

    it('должен удалить пользователя', async () => {
        const createRes = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'ToDelete',
                secondName: 'User',
                age: 29,
                city: 'Aktau',
                email: 'delete@example.com',
                password: 'deletepass'
            });

        const id = createRes.body.id;

        const deleteRes = await request(app)
            .delete(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body).toEqual({ status: 'removed' });
    });

    it('должен вернуть 401 при доступе без токена', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(401);
    });

    it('должен вернуть 400 при некорректном ID', async () => {
        const token = await getToken(); // вспомогательная функция, описана ниже
        const res = await request(app)
            .get('/users/invalid-id')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
    });

    it('должен вернуть 400 при создании пользователя с неверными данными', async () => {
        const token = await getToken();
        const res = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'A' });
        expect(res.statusCode).toBe(400);
    });
});
