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

  test("#patch should return the article with the updated vote count, article id 2 has 0 votes so should return with 20 votes", async () => {
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
  test("#patch should return the article with the updated vote count, article id 1, has 100 show should return 120", async () => {
    const updateVotes = { inc_votes: -120 };
    await request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(202)
      .then((res) => {
        // console.log(res.body);
        expect(res.body.article.votes).toBe(-20);
      });
    })

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

  test("#get wrong data type in the parametric", async () => {
    await request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });

  test("#get article that doesnt exist", async () => {
    await request(app)
      .get("/api/articles/999")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });

  test("#patch wrong type of data on the votes object", async () => {
    const updateVotes = { inc_votes: 'dog' };
    await request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(400)
      .then((res) => {
        // console.log(res.body);
        expect(res.body.msg).toBe("Bad Request");
      });
    })

    test("#patch has additional properties on the update object, should reject with 400", async () => {
        const updateVotes = { inc_votes: -120, name : 'mitch' };
        await request(app)
          .patch("/api/articles/1")
          .send(updateVotes)
          .expect(400)
          .then((res) => {
            console.log(res.body);
            expect(res.body.msg).toBe("Bad Request");
          });
        })
});
