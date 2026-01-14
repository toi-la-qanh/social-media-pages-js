import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import type { Express } from "express";

export class RetweetTest {
  static register(app: Express) {
    describe("Retweet API (integration)", () => {
      it("POST /api/posts/:post_id/retweets should return 401 when unauthenticated", async () => {
        const res = await request(app).post("/api/posts/p1/retweets");
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("errors");
      });
    });
  }
}


