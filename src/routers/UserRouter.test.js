import { describe, test } from "vitest";
import request from "supertest";
import app from "../app.js";
import { Types } from "mongoose";

const req = request.agent(app);
let token = "";

function userTest() {
  test("GET /users/all", async ({ expect }) => {
    const res = await req.get("/users/all");
    expect(res.status).toBe(200);
  });

  test("GET /users/:id with invalid id", async ({ expect }) => {
    const res = await req.get("/users/test");
    expect(res.body.error).toBe("Invalid ObjectID");
    expect(res.status).toBe(400);
  });

  test("GET /users/:id with valid id and id not found", async ({ expect }) => {
    const res = await req.get(`/users/${new Types.ObjectId().toString()}`);
    expect(res.status).toBe(404);
  });
}

describe("UserRouter before login/register", () => {
  test("GET /users", async ({ expect }) => {
    const res = await req.get("/users");
    expect(res.status).toBe(401);
  });

  userTest();
});

describe("UserRouter after login/register", () => {
  test("POST /users/register", async ({ expect }) => {
    const res = await req.post("/users/register").send({
      firstname: "test",
      lastname: "test",
      email: "test@test.fr",
      password: "123456789",
    });
    expect(res.status).toBe(201);
  });

  test("POST /users/login with invalid credentials", async ({ expect }) => {
    const res = await req.post("/users/login").send({
      email: "test@test.fr",
      password: "12345678",
    });
    expect(res.status).toBe(401);
  });

  test("POST /users/login with valid credentials", async ({ expect }) => {
    const res = await req.post("/users/login").send({
      email: "test@test.fr",
      password: "123456789",
    });
    expect(res.status).toBe(200);
    token = res.body.token;
  });

  test("GET /users", async ({ expect }) => {
    const res = await req
      .get("/users")
      .set({ Authorization: `Bearer ${token}` });
    expect(res.status).toBe(200);
  });

  userTest();

  test("GET /users/:id with valid id and id found", async ({ expect }) => {
    const res = await req
      .get("/users")
      .set({ Authorization: `Bearer ${token}` });
    const user = res.body;
    const res2 = await req
      .get(`/users/${user._id}`)
      .set({ Authorization: `Bearer ${token}` });
    expect(res2.status).toBe(200);
  });
});
