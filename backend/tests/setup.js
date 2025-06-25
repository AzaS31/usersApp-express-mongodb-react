const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDb, closeConnection } = require('../database/db');
const { getUsersCollection } = require('../database/db');

let mongoServer;

module.exports = {
    startTestDB: async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await connectDb(mongoUri);

        console.log('Test DB started at:', mongoUri);
    },

    stopTestDB: async () => {
        await closeConnection();
        await mongoServer.stop();
        console.log('Test DB stopped');
    },

    clearTestDB: async () => {
        const db = getUsersCollection().s.db; // Получаем объект базы данных
        const collections = await db.collections();

        for (const collection of collections) {
            await collection.deleteMany({});
        }

        console.log('Test DB cleared');
    }
};
