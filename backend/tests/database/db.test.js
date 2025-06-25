const { connectDb, getUsersCollection, closeConnection } = require('../../database/db');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDb(uri, 'testdb');
});

afterAll(async () => {
  await closeConnection();
  await mongoServer.stop();
});

describe('Database module', () => {
  test('getUsersCollection() должен вернуть коллекцию', () => {
    const collection = getUsersCollection();
    expect(collection).toBeDefined();
    expect(typeof collection.find).toBe('function'); // проверка, что это Mongo коллекция
  });

  test('getUsersCollection() выбрасывает ошибку без connectDb', async () => {
    await closeConnection();
    expect(() => getUsersCollection()).toThrow('Database not initialized. Call connectDb first.');
  });

  test('closeConnection() должен сбрасывать клиент и коллекцию', async () => {
    const uri = mongoServer.getUri();
    await connectDb(uri, 'testdb');
    await closeConnection();
    expect(() => getUsersCollection()).toThrow();
  });
});
