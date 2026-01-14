import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import type { Express } from "express";

export class FollowTest {
  static register(app: Express) {
    describe("Follow API (integration)", () => {
      it("POST /api/users/:following_id/follow should return 401 when unauthenticated", async () => {
        const res = await request(app).post("/api/users/u1/follow");
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("errors");
      });
    });
  }
}


