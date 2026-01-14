import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import type { Express } from "express";

export class LikeTest {
  static register(app: Express) {
    describe("Like API (integration)", () => {
      it("POST /api/posts/:post_id/likes should return 401 when unauthenticated", async () => {
        const res = await request(app).post("/api/posts/p1/likes");
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("errors");
      });
    });
  }
}


