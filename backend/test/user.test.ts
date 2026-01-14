import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import type { Express } from "express";
import createSecretToken from "../src/auth/token";
import bcrypt from "bcrypt";
import { userHashids } from "../src/utils/hashids";
/**
 * Real integration tests (no mocks).
 * Per request: only assert status + message/shape (no DB mutation assertions).
 */
export class UserTest {
  static async createUser() {
    return {
      id: 1,
      email: "test@example.com",
      full_name: "Test User",
      username: "test_user",
      password: await bcrypt.hash("Aa1@aaaa", 10),
    };
  }
  static register(app: Express) {
    describe("User API (integration)", () => {
      it("GET /api/users/me should return 401 when unauthenticated", async () => {
        const res = await request(app).get("/api/users/me");
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("errors");
      });

      it("GET /api/users/me?lang=vi should return Vietnamese auth error", async () => {
        const res = await request(app).get("/api/users/me?lang=vi");
        expect(res.statusCode).toBe(401);
        // Language switching currently implemented for auth + user routes
        expect(res.body.errors).toBe("Người dùng chưa xác thực");
      });

      it("GET /api/users/search should validate q (returns 400)", async () => {
        const res = await request(app).get("/api/users/search");
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty("errors");
      });
    });
  }

  static async getAuthCookie(): Promise<string> {
    const user = await this.createUser();
    const token = createSecretToken(userHashids.encode(user.id));
    return token;
  }
}


