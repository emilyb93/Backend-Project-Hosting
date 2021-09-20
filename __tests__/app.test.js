const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("#api", () => {
  test("#get /api", async () => {
    await request(app)
      .get(`/api`)
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toBe("Hello Welcome to the NC News API");
      });
  });
});

describe("/api/topics", () => {
  test("#get", async () => {
    await request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toHaveLength(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("#get", async () => {
    await request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
  });
  
});

describe("#error handling", () => {
  test("#get /doesntexist", async () => {
    await request(app)
      .get(`/doesntexist`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });

  test("#get", async () => {
    await request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request")
      });
  });
});
