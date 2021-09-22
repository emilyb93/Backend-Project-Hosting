const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("#api", () => {
  test("request api homepage", async () => {
    const res = await request(app).get(`/api`);

    expect(res.status).toBe(200);

    expect(res.body.msg).toBe("Hello Welcome to the NC News API");
    expect(res.body.endpoints).toBeInstanceOf(Object);
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

describe("/api/articles/:article_id/comments", () => {
  describe("#GET", () => {
    test("request an array of all the comments for an article", async () => {
      const res = await request(app).get("/api/articles/1/comments");
      expect(res.status).toBe(200);
      res.body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
        // console.log(res.body)
      });
    });
    test("request an array of all the comments for an article that has no comments", async () => {
      const res = await request(app).get("/api/articles/2/comments");
      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(0);
    });
  });

  describe.only("#POST", () => {
    test("should post a comment to an article, given in the parametric", async () => {
      const sentComment = {
        username: "icellusedkars",
        body: "first",
      };

      const res = await request(app)
        .post("/api/articles/1/comments")
        .send(sentComment);

      expect(res.status).toBe(202);
      expect(res.body.msg).toBe("Accepted");

      const expectedObject = {
        "comment_id": expect.any(Number),
        "author": "icellusedkars",
        "article_id": 1,
        "votes": expect.any(Number),
        "created_at": expect.anything(),
        "body": "first",
      };

      // console.log(rses.body)
      expect(res.body.comment).toMatchObject(expectedObject);
    });

    describe('error handling', () => {
      test('pass an object with a username that doesnt exist', async() => {
        const comment = {
          "username": "xx_sniper_xx",
          "body" : "my mom thinks im cool"
        }
        const res = await request(app)

                          .post('/api/articles/1/comments')
                          .send(comment)

                          expect(res.status).toBe(404)
                          expect(res.body.msg).toBe("Not Found")
      });
    });
  });
});
describe("error handling", () => {
  test("request article comments where the article doesnt exist", async () => {
    const res = await request(app).patch("/api/articles/600/comments");

    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Not Found");
  });

  test("wrong data type in the parametric", async () => {
    await request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles/", () => {
  describe("#GET", () => {
    test("request an article object", async () => {
      const res = await request(app).get("/api/articles/1/");
      expect(res.status).toBe(200);
      // console.log(res.body);
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

    test("requesting with a sort_by query", async () => {
      const res = await request(app).get("/api/articles?sort_by=date");

      expect(res.status).toBe(200);
      const datesFromRes = res.body.articles.map((article) => {
        return article.created_at;
      });

      expect(datesFromRes).toBeSorted();
    });

    test("requesting without a sort_by query, should order by date", async () => {
      const res = await request(app).get("/api/articles");

      expect(res.status).toBe(200);
      const datesFromRes = res.body.articles.map((article) => {
        return article.created_at;
      });

      expect(datesFromRes).toBeSorted();
    });

    test("requesting with a query of order=desc", async () => {
      const res = await request(app).get("/api/articles?order=desc");

      expect(res.status).toBe(200);
      const datesFromRes = res.body.articles.map((article) => {
        return article.created_at;
      });

      datesFromRes.reverse();

      expect(datesFromRes).toBeSorted();
    });

    test("requesting with a query of topic=cats, expected to be in date order", async () => {
      const res = await request(app).get("/api/articles?topic=cats");

      expect(res.status).toBe(200);
      const datesFromRes = res.body.articles.map((article) => {
        return article.created_at;
      });
      res.body.articles.map((article) => {
        expect(article.topic).toBe("cats");
      });

      expect(datesFromRes).toBeSorted();
    });

    test("requesting with a queries of ?topic=cats&sort_by=article_id&order=desc, expected to be in date order", async () => {
      const res = await request(app).get(
        "/api/articles?topic=cats&sort_by=article_id&order=desc,"
      );
      // console.log(res.body);

      expect(res.status).toBe(200);
      const articleIDsFromRes = res.body.articles.map((article) => {
        return article.article_id;
      });
      res.body.articles.map((article) => {
        expect(article.topic).toBe("cats");
      });

      expect(articleIDsFromRes).toBeSorted();
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
