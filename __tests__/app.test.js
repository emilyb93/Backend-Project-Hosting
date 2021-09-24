const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const { string } = require("pg-format");
const { length } = require("../db/data/test-data/articles.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("#api", () => {
  test("request api homepage", async () => {
    const res = await request(app).get(`/api`);

    expect(res.status).toBe(200);

    expect(res.body.msg).toBe(
      "Hello Welcome to the NC News API, NOW DEPLOYED WITH CI/CD"
    );
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
      expect(res.body.comments.length).toBeGreaterThan(0);
      res.body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
        // // console.log(res.body)
      });
    });
    test("request an array of all the comments for an article that has no comments", async () => {
      const res = await request(app).get("/api/articles/2/comments");
      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(0);
      console.log(res.body)
    });

    describe("error handling", () => {
      test("requesting non existent article comments", async () => {
        const res = await request(app).get("/api/articles/9999/comments");
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });

      test("request article comments where the article doesnt exist", async () => {
        const res = await request(app).get("/api/articles/600/comments");

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

      expect(res.status).toBe(201);
      expect(res.body.msg).toBe("Created");

      const expectedObject = {
        comment_id: expect.any(Number),
        author: "icellusedkars",
        article_id: 1,
        votes: expect.any(Number),
        created_at: expect.anything(),
        body: "first",
      };

      expect(res.body.comment).toMatchObject(expectedObject);
    });

    describe("error handling", () => {
      test.only("pass an object with a username that doesnt exist", async () => {
        const comment = {
          username: "xx_sniper_xx",
          body: "my mom thinks im cool",
        };
        const res = await request(app)
          .post("/api/articles/1/comments")
          .send(comment);

        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });

      test.only('pass object missing username', async () => {
        const comment = {
          body: "my mom thinks im cool"
        };
        const res = await request(app)
          .post("/api/articles/1/comments")
          .send(comment);

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test.only("pass object with no body", async()=>{
        const comment = {
          username : "icellusedkars"
        }
        const res = await request(app).post('/api/articles/1/comments').send(comment)
        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("Bad Request")
      })
    });
  });
});

describe("/api/articles/", () => {
  describe("#GET", () => {
    test("request a single article by id", async () => {
      const res = await request(app).get("/api/articles/1/");
      expect(res.status).toBe(200);
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

    test("request an array of all articles with no queries", async () => {
      const res = await request(app).get("/api/articles");

      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBeGreaterThan(0);
      expect(res.body.articles).toBeSortedBy("created_at", {
        descending: true,
      });

      res.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        });
      });
    });

    test("requesting with a sort_by query", async () => {
      const res = await request(app).get("/api/articles?sort_by=votes");

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);

      expect(res.body.articles).toBeSortedBy("votes", { descending: true });
    });

    test("requesting without a sort_by query, should order by date", async () => {
      const res = await request(app).get("/api/articles");

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);

      expect(res.body.articles).toBeSortedBy("created_at", {
        descending: true,
      });
    });

    test("requesting with a query of order=desc", async () => {
      const res = await request(app).get("/api/articles?order=desc");

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);

      expect(res.body.articles).toBeSortedBy("created_at", {
        descending: true,
      });
    });

    test("requesting with a query of topic=cats, expected to be in date order", async () => {
      const res = await request(app).get("/api/articles?topic=cats");

      expect(res.status).toBe(200);

      res.body.articles.forEach((article) => {
        expect(article.topic).toBe("cats");
      });
      expect(res.body.articles.length).toBeGreaterThan(0);

      expect(res.body.articles).toBeSortedBy("created_at", {
        descending: true,
      });
    });

    test("requesting with a queries of ?topic=cats&sort_by=article_id&order=asc, expected to be in date order", async () => {
      const res = await request(app).get(
        "/api/articles?topic=mitch&sort_by=article_id&order=asc"
      );

      expect(res.status).toBe(200);

      res.body.articles.map((article) => {
        expect(article.topic).toBe("mitch");
      });
      expect(res.body.articles.length).toBeGreaterThan(0);

      expect(res.body.articles).toBeSortedBy("article_id", {
        descending: false,
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
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Not Found");
          });
      });

      test("queried with an order=bananas", async () => {
        const res = await request(app).get("/api/articles?order=bananas");

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
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
          // // console.log(res.body);
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
      test("updateObj has incorrect key", async () => {
        const res = await request(app)
          .patch("/api/articles/1")
          .send({ dog: 20 });
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("delete comment when comment id supplied", async () => {
      const res = await request(app).delete("/api/comments/1");
      expect(res.status).toBe(202);
    });
    describe("error handling", () => {
      test("the comment doesnt exist", async () => {
        const res = await request(app).delete("/api/comments/45511");
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });

      test("the parametric is not an int", async () => {
        const res = await request(app).delete("/api/comments/badcomment");
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("the parametric is a negative int", async () => {
        const res = await request(app).delete("/api/comments/-1");
        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });
    });
  });
  describe.skip("PATCH", () => {
    test("should alter the votes of a comment by the amount given", async () => {
      const updateObj = {
        inc_votes: 10,
      };

      const res = await request(app).patch("/api/comments/1").send(updateObj);
      console.log(res.body);
      expect(res.status).toBe(202);
      expect(res.body.comment).toMatchObject({
        comment_id: 1,
        body: expect.any(String),
        votes: 26,
        author: expect.any(String),
        created_at: expect.any(String),
      });
    });
  });

  describe("error handling", () => {
    test("comment id given doesnt exist", async () => {
      const updateObj = {
        inc_votes: 10,
      };

      const res = await request(app)
        .patch("/api/comments/1565456")
        .send(updateObj);
      expect(res.status).toBe(404);
      expect(res.body.msg).toBe("Not Found");
    });

    test("comment id is invalid data type", async () => {
      const updateObj = {
        inc_votes: 10,
      };
      const res = await request(app)
        .patch("/api/comments/funnycomment")
        .send(updateObj);

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Bad Request");
    });

    test("updateObj is incorrect format", async () => {
      const updateObj1 = {
        inc_votes: "ten",
      };

      const res = await request(app).patch("/api/comments/1").send(updateObj1);

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Bad Request");

      const updateObj2 = {
        incoming_votes: 10,
      };

      const res2 = await request(app).patch("/api/comments/1").send(updateObj2);

      expect(res2.status).toBe(400);
      expect(res2.body.msg).toBe("Bad Request");
    });
  });
});

describe("/api/users", () => {
  describe("#GET", () => {
    test("request an array of objects with usernames", async () => {
      const res = await request(app).get("/api/users");
      // console.log(res.body)
      expect(res.status).toBe(200);
      // console.log(res.body)
      expect(res.body.users.length).toBeGreaterThan(0);
      res.body.users.forEach((userObj) => {
        expect(typeof userObj.username).toBe("string");
        expect(Object.keys(userObj)).toHaveLength(1);
      });
    });
  });

  describe("/api/users/:username", () => {
    describe("GET", () => {
      test("request a specific username object by username", async () => {
        const res = await request(app).get("/api/users/icellusedkars");
        // console.log(res.body)

        const checkObj = {
          username: "icellusedkars",
          avatar_url: expect.any(String),
          name: expect.any(String),
        };

        // // console.log(res.body)
        expect(res.status).toBe(200);
        expect(res.body.user).toMatchObject(checkObj);
      });
    });

    describe("error handling", () => {
      test("username doesnt exist", async () => {
        const res = await request(app).get("/api/users/joeyjojojuniorshabadoo");

        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });
    });
  });
});
