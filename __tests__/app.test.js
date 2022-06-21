const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("#api", () => {
  describe("GET", () => {
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
});

describe("/api/topics", () => {
  describe("GET", () => {
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
      });
    });
    test("request an array of all the comments for an article that has no comments", async () => {
      const res = await request(app).get("/api/articles/2/comments");
      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(0);
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

  describe("#POST", () => {
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
      test("pass an object with a username that doesnt exist", async () => {
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

      test("pass object missing username", async () => {
        const comment = {
          body: "my mom thinks im cool",
        };
        const res = await request(app)
          .post("/api/articles/1/comments")
          .send(comment);

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("pass object with no body", async () => {
        const comment = {
          username: "icellusedkars",
        };
        const res = await request(app)
          .post("/api/articles/1/comments")
          .send(comment);
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });
    });
  });
});

describe("/api/articles/:article_id", () => {
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
    });
  });
});

describe("/api/articles/", () => {
  describe("GET", () => {
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

    test('requesting a query with "author" to get only posts by a certain author', async () => {
      const res = await request(app).get("/api/articles?author=icellusedkars");

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);
      res.body.articles.map((article) => {
        expect(article.author).toBe("icellusedkars");
      });
    });

    test("requesting a query with author and a sort by should filter and sort articles", async () => {
      const res = await request(app).get(
        "/api/articles?author=icellusedkars&sort_by=votes"
      );

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);
      res.body.articles.map((article) => {
        expect(article.author).toBe("icellusedkars");
      });

      expect(res.body.articles).toBeSortedBy("votes", { descending: true });
    });

    test("requesting a query with author, sort by, and order, should filter and sort articles in requested order", async () => {
      const res = await request(app).get(
        "/api/articles?author=icellusedkars&sort_by=votes&order=asc"
      );

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);
      res.body.articles.map((article) => {
        expect(article.author).toBe("icellusedkars");
      });

      expect(res.body.articles).toBeSortedBy("votes", { descending: false });
    });

    test("requesting a query with author and topic should filter articles correctly", async () => {
      const res = await request(app).get(
        "/api/articles?author=icellusedkars&topic=mitch"
      );

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);
      res.body.articles.map((article) => {
        expect(article.author).toBe("icellusedkars");
        expect(article.topic).toBe("mitch");
      });
    });

    test("requesting a query with author and topic, along with sort and order, should filter articles correctly with correct sorting", async () => {
      const res = await request(app).get(
        "/api/articles?author=icellusedkars&topic=mitch&sort_by=votes&order=asc"
      );

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);
      res.body.articles.map((article) => {
        expect(article.author).toBe("icellusedkars");
        expect(article.topic).toBe("mitch");
      });

      expect(res.body.articles).toBeSortedBy("votes", { descending: false });
    });

    test("should be able to sort by comment_count", async () => {
      const res = await request(app).get("/api/articles?sort_by=comment_count");

      expect(res.status).toBe(200);

      expect(res.body.articles.length).toBeGreaterThan(0);

      expect(res.body.articles).toBeSortedBy("comment_count", {
        descending: true,
      });
    });

    test("should be able to sort by comment_count in compound queries", async () => {
      const res = await request(app).get(
        "/api/articles?author=icellusedkars&topic=mitch&sort_by=comment_count&order=asc"
      );

      expect(res.status).toBe(200);

      expect(res.body.articles).toHaveLength(6);
      res.body.articles.map((article) => {
        expect(article.author).toBe("icellusedkars");
        expect(article.topic).toBe("mitch");
      });

      expect(res.body.articles).toBeSortedBy("comment_count", {
        descending: false,
      });
    });

    describe("error handling", () => {
      test("queried with order that is not an accepted term", async () => {
        const res = await request(app).get("/api/articles?order=bananas");

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("queried with sort by that is not an accepted query", async () => {
        const res = await request(app).get("/api/articles?sort_by=coolness");

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("queried with a topic that is not in the database ", async () => {
        const res = await request(app).get("/api/articles?topic=funnycatmemes");

        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });

      test("query with a key that is not in the accepted query terms", async () => {
        const res = await request(app).get("/api/articles?votes=0");

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
          expect(res.body.article.votes).toBe(20);
        });
    });
    test("updating vote count", async () => {
      // article id 1, has 100 votes should return -20
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
      expect(res.status).toBe(204);
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
  describe("PATCH", () => {
    test("should alter the votes of a comment by the amount given", async () => {
      const updateObj = {
        inc_votes: 10,
      };
      //comment_id 1 has a vote count of 16 in the test data, we should expect 21
      const res = await request(app).patch("/api/comments/1").send(updateObj);
      expect(res.status).toBe(202);
      expect(res.body.comment).toMatchObject({
        comment_id: 1,
        body: expect.any(String),
        votes: 26,
        author: expect.any(String),
        created_at: expect.any(String),
      });
    });

    describe("error handling", () => {
      test("comment id does not exist", async () => {
        const updateObj = {
          inc_votes: 10,
        };
        const res = await request(app)
          .patch("/api/comments/43194013")
          .send(updateObj);

        expect(res.status).toBe(404);
        expect(res.body.msg).toBe("Not Found");
      });

      test("update object has incorrect key", async () => {
        const updateObj = {
          votes: 10,
        };

        const res = await request(app).patch("/api/comments/4").send(updateObj);

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("update object has incorrect data type for inc_votes", async () => {
        const updateObj = {
          inc_votes: "twenty",
        };

        const res = await request(app).patch("/api/comments/3").send(updateObj);

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("inc_votes has a value of 0", async () => {
        const updateObj = {
          inc_votes: 0,
        };

        const res = await request(app).patch("/api/comments/2").send(updateObj);

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("update object has more keys than expected", async () => {
        const updateObj = {
          inc_votes: 10,
          comment: "more votes, rad",
        };

        const res = await request(app).patch("/api/comments/1").send(updateObj);

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
      });

      test("parametric is not the right data type: string instead of number", async () => {
        const updateObj = {
          inc_votes: 10,
          comment: "more votes, rad",
        };

        const res = await request(app)
          .patch("/api/comments/thatcommentiread")
          .send(updateObj);

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("Bad Request");
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
      expect(res.status).toBe(200);
      expect(res.body.users.length).toBeGreaterThan(0);
      res.body.users.forEach((userObj) => {
        expect(typeof userObj.username).toBe("string");
        expect(Object.keys(userObj)).toHaveLength(1);
      });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("request a specific username object by username", async () => {
      const res = await request(app).get("/api/users/icellusedkars");

      const checkObj = {
        username: "icellusedkars",
        avatar_url: expect.any(String),
        name: expect.any(String),
      };

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
