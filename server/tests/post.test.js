import dotenv from "dotenv";
import { jest } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { initDb, pool } from "../config/db.js";

// Always load .env.test if present, fallback to .env
import fs from "fs";
const envTestPath = new URL("../.env.test", import.meta.url).pathname;
const envPath = new URL("../.env", import.meta.url).pathname;
if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

jest.setTimeout(30000);

describe("Post Routes", () => {
  let token;
  let user;

  beforeAll(async () => {
    await initDb();
    await pool.query("DELETE FROM posts; DELETE FROM users;");

    const regRes = await request(app).post("/api/users/register").send({
      name: "Author User",
      email: "author@example.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/users/login").send({
      email: "author@example.com",
      password: "password123",
    });

    token = loginRes.body.token;
    user = loginRes.body.user;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM posts; DELETE FROM users;");
    await pool.end();
  });

  test("should create a post, retrieve it, update it, and delete it", async () => {
    // 1. Create Post
    const createRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post on Neon Postgres",
        content: "This is sample content for testing Neon Postgres.",
        category: "Technology",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    const postId = createRes.body.data._id || createRes.body.data.id;
    expect(postId).toBeDefined();

    // 2. Get All Posts
    const getRes = await request(app).get("/api/posts");
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.length).toBeGreaterThanOrEqual(1);

    // 3. Get Post By Id
    const getByIdRes = await request(app).get(`/api/posts/${postId}`);
    expect(getByIdRes.status).toBe(200);
    expect(getByIdRes.body.data.title).toBe("Test Post on Neon Postgres");

    // 4. Update Post
    const updateRes = await request(app)
      .put(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
      });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe("Updated Title");

    // 5. Delete Post
    const deleteRes = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });
});
