const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fixEmployeeIndex = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MONGO_URI not found in environment variables');
      console.log('Please make sure backend/.env file exists with MONGO_URI');
      process.exit(1);
      return;
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    console.log('Database name:', db.databaseName);
    
    const collection = db.collection('exhibitors');

    // Check if collection exists
    const collections = await db.listCollections({ name: 'exhibitors' }).toArray();
    if (collections.length === 0) {
      console.log('Exhibitors collection does not exist yet. No index to drop.');
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    // List all indexes first
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop the unique index on employees.employeeNumber
    const indexToDrop = 'employees.employeeNumber_1';
    const indexExists = indexes.some(idx => idx.name === indexToDrop);
    
    if (indexExists) {
      try {
        await collection.dropIndex(indexToDrop);
        console.log(`Successfully dropped index: ${indexToDrop}`);
      } catch (error) {
        console.error('Error dropping index:', error.message);
      }
    } else {
      console.log(`Index ${indexToDrop} does not exist. Nothing to drop.`);
    }

    console.log('Index fix completed');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

fixEmployeeIndex();
