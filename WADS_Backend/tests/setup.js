import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

let mongod;

// Set default test environment variables if not present
process.env.FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyAy-Ah-QphXhftpA6iwzEyhJqKh6PjA3CQ';
process.env.FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || 'semestamedikaapp.firebaseapp.com';
process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'semestamedikaapp';
process.env.FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'semestamedikaapp.firebasestorage.app';
process.env.FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID || '513901903795';
process.env.FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || '1:513901903795:web:1d2bfe916b2e0b89e955c6';
process.env.FIREBASE_MEASUREMENT_ID = process.env.FIREBASE_MEASUREMENT_ID || 'G-3PFZSFD5W8';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_test_gemini_api_key';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

// Setup before all tests
export const setup = async () => {
    // Create an in-memory MongoDB instance
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Set the MongoDB URI to the in-memory instance
    process.env.MONGODB_URI = uri;
};

// Cleanup after all tests
export const teardown = async () => {
    // Close MongoDB connection
    await mongoose.disconnect();
    
    // Stop the in-memory MongoDB instance
    if (mongod) {
        await mongod.stop();
    }
};

// Clear database between tests
export const clearDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
        }
    }
}; 