const request = require('supertest');
const jwt = require('jsonwebtoken');
const { getUsersCollection } = require('../../database/db');
const app = require('../../app');
const {
  startTestDB,
  stopTestDB,
  clearTestDB,
} = require('../setup');

// Генерация валидного JWT-токена
const generateToken = () => {
  const payload = { id: 'test-user-id' }; 
  const secret = process.env.JWT_SECRET || 'secret_key';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

describe('Users API Integration Tests', () => {
  let usersCollection;
  let token;

  beforeAll(async () => {
    await startTestDB();
    usersCollection = getUsersCollection();
    token = generateToken(); // создаём токен до запуска тестов
  });

  afterAll(async () => {
    await stopTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  test('GET /users должен возвращать пустой массив, если нет пользователей', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ users: [] });
  });

  test('POST /users создаёт пользователя, GET /users/:id возвращает этого пользователя', async () => {
    const user = {
      firstName: 'Ivan',
      secondName: 'Ivanov',
      age: 25,
      city: 'Moscow',
      email: 'ivan@example.com',
    };

    const postRes = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);

    expect(postRes.status).toBe(200);
    expect(postRes.body).toHaveProperty('id');

    const id = postRes.body.id;

    const getRes = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.user).toMatchObject(user);
    expect(getRes.body.user._id).toBe(id);
  });

  test('PUT /users/:id обновляет пользователя', async () => {
    const { insertedId } = await usersCollection.insertOne({
      firstName: 'Anna',
      secondName: 'Petrova',
      age: 30,
      city: 'Saint Petersburg',
      email: 'ivan@example.com',
    });

    const updateData = {
      firstName: 'Ann',
      secondName: 'Petrova',
      age: 31,
      city: 'Saint Petersburg',
      email: 'ivan@example.com',
    };

    const putRes = await request(app)
      .put(`/users/${insertedId.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(putRes.status).toBe(200);
    expect(putRes.body.status).toBe('updated');
    expect(putRes.body.user).toMatchObject(updateData);
    expect(putRes.body.user._id).toBe(insertedId.toString());
  });

  test('DELETE /users/:id удаляет пользователя', async () => {
    const { insertedId } = await usersCollection.insertOne({
      firstName: 'Mark',
      secondName: 'Smith',
      age: 40,
      city: 'New York',
    });

    const delRes = await request(app)
      .delete(`/users/${insertedId.toString()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body.status).toBe('removed');

    const userAfterDelete = await usersCollection.findOne({ _id: insertedId });
    expect(userAfterDelete).toBeNull();
  });
});
