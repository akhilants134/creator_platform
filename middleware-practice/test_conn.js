const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Thelight_101:Ukej6JK3DkNkMKth@cluster0.ngeefqo.mongodb.net/practice_db?retryWrites=true&w=majority";
const client = new MongoClient(uri);
console.log('Testing connection with URI:', uri);
client.connect()
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });