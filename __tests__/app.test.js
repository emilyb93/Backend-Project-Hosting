const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed  = require('../db/seeds/seed.js');
const app = require("../app")


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('#api', () => {
    test('#get /api', async () => {
        await request(app)
        .get(`/api`)
        .expect(200)
        .then((res)=>{
            expect(res.body.msg).toBe("Hello Welcome to the NC News API")
        })
    });
    
});

describe('#error handling', () => {
    test('#get /wrongapi', async () => {
        await request(app)
        .get(`/wrongapi`)
    });
});
