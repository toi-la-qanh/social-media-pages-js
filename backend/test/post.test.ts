import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import type { Express } from "express";

export class PostTest {
  static register(app: Express) {
    describe("Post API (integration)", () => {
      it("GET /api/posts should return 200 or 404 (depends on DB seed)", async () => {
        const res = await request(app).get("/api/posts");
        expect([200, 404]).toContain(res.statusCode);
        if (res.statusCode === 404) {
          expect(res.body).toHaveProperty("errors");
        }
      });

      it("POST /api/posts should return 401 when unauthenticated", async () => {
        const res = await request(app).post("/api/posts").send({ content: "hello" });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("errors");
      });
    });
  }
}


