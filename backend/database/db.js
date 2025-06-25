const { MongoClient } = require('mongodb');

let client;  
let usersCollection;

async function connectDb(uri, dbName = 'usersdb') {
  client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  usersCollection = db.collection('users');
  return { client, usersCollection };
}

function getUsersCollection() {
  if (!usersCollection) {
    throw new Error('Database not initialized. Call connectDb first.');
  }
  return usersCollection;
}

async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    usersCollection = null;
  }
}

module.exports = { 
  connectDb, 
  getUsersCollection, 
  closeConnection  
};