const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// --- Test Setup ---
// Before all tests, start a new in-memory MongoDB
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

// After all tests, disconnect and stop the in-memory DB
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// --- The Test Suite ---
describe('Project API Tests', () => {

    // Test Case 1: Can we GET the projects?
    it('should fetch all projects (as an empty array)', async () => {
        // 1. Send the request
        const response = await request(app).get('/api/projects');
        
        // 2. Check the response
        expect(response.statusCode).toBe(200); // Expect OK status
        expect(response.body).toEqual([]);     // Expect an empty array
    });
    
    // We will add more tests here (like POST, DELETE) later
});