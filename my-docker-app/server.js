// server.js

const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json()); // for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // for parsing form data

// MongoDB connection details
// We'll use environment variables in Docker, but let's set a default fallback
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDbName = process.env.MONGO_DB || 'my-db';

let db;

async function connectToMongo() {
  const url = `mongodb://${mongoHost}:${mongoPort}`;
  const client = new MongoClient(url);

  try {
    await client.connect();
    db = client.db(mongoDbName);
    console.log(`Connected to MongoDB at ${url}, using database "${mongoDbName}"`);
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
  }
}

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the profile image
app.get('/profile-picture', (req, res) => {
  const img = fs.readFileSync(path.join(__dirname, 'profile-1.jpg'));
  res.writeHead(200, { 'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

// Endpoint to get user data from MongoDB
app.get('/api/user', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ name: 'Anna Smith' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Endpoint to update user data in MongoDB
app.post('/api/user', async (req, res) => {
  const { name, email, interests } = req.body;

  try {
    // Upsert user record
    const result = await db.collection('users').updateOne(
      { name: 'Anna Smith' },
      { $set: { name, email, interests } },
      { upsert: true }
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Start server & connect to DB
const port = 3000;
app.listen(port, async () => {
  console.log(`App listening on port ${port}`);
  await connectToMongo();
});