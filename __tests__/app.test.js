const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("#api", () => {
  test("request api homepage", async () => {
    await request(app)
      .get(`/api`)
      .expect(200)
      .then((res) => {
        expect(res.body.msg).toBe("Hello Welcome to the NC News API");
      });
  });

  describe("error handling", () => {
    test("request non existent endpoint", async () => {
      await request(app)
        .get(`/doesntexist`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
  });
});

describe("/api/topics", () => {
  test("request all topics", async () => {
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

describe("/api/articles", () => {
  describe("#GET", () => {
    test.only("request an array of all articles", async () => {
      const res = await request(app).get("/api/articles/1/comments");
      expect(res.status).toBe(200)
      res.body.comments.forEach((comment)=>{
        expect(comment).toMatchObject({
          comment_id : expect.any(Number),
          votes : expect.any(Number),
          created_at : expect.any(Date),
          author : expect.any(String),
          body : expect.any(String)
        })
      })
    });
  });
});
describe("/api/articles/:article_id", () => {
  describe("#GET", () => {
    test("requesting article by id", async () => {
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

    describe("error handling", () => {
      test("wrong data type in the parametric", async () => {
        await request(app)
          .get("/api/articles/dog")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad Request");
          });
      });

      test("article that doesnt exist", async () => {
        await request(app)
          .get("/api/articles/999")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad Request");
          });
      });
    });

    // describe('/api/articles/:article_id/comments', () => {
    //   describe('#POST', () => {
    //     test('posting a comment', () => {

    //     });
    //   });
    // });
  });

  describe("#PATCH", () => {
    test("updating vote count", async () => {
      // article id 2 has 0 votes so should return with 20 votes
      const updateVotes = { inc_votes: 20 };
      await request(app)
        .patch("/api/articles/2")
        .send(updateVotes)
        .expect(202)
        .then((res) => {
          // console.log(res.body);
          expect(res.body.article.votes).toBe(20);
        });
    });
    test("updating vote count", async () => {
      // article id 1, has 100 show should return 120
      const updateVotes = { inc_votes: -120 };
      await request(app)
        .patch("/api/articles/1")
        .send(updateVotes)
        .expect(202)
        .then((res) => {
          // console.log(res.body);
          expect(res.body.article.votes).toBe(-20);
        });
    });

    describe("error handling", () => {
      test("update object has 0 votes", async () => {
        const res = await request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 0 });

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("update object has wrong data type", async () => {
        const res = await request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "three" });

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("update object has more properties than expected", async () => {
        const res = await request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 0, name: "mitch" });

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });
      test("article_id doesnt exist to update", async () => {
        const res = await request(app)
          .patch("/api/articles/600")
          .send({ inc_votes: 20 });

        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });
    });
  });
});
