process.env.NODE_ENV = "test";

const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");
const conn = require("../../db");

describe("GET /user", () => {
  before((done) => {
    conn
      .connect()
      .then(() => {
        done();
      })
      .catch((err) => done(err));
  });

  after((done) => {
    conn
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  it("Fetching existing User by IP(create user if doesn't exist)", async (done) => {
    try {
      res = await request(app).post("/api/user").send({ ip: "192.168.0.1" });
      console.log(res);
      done();
    } catch (err) {
      console.log(err);
      done(err);
    }
  });
});
