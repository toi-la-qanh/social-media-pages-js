import request from "supertest";
import { describe, it, expect, afterAll } from "@jest/globals";
import { app, server } from "../src/index";
import socketClient from "socket.io-client";
import { config } from '@dotenvx/dotenvx';
config({ path: ['.env'], ignore: ['MISSING_ENV_FILE'] });

import sql from "../src/database/config/postgres";

(async () => {
    try {
      // Example query to test the connection
      await sql`SELECT 1`;        
      console.log("✅ Database connected");
  
    } catch (err) {
      console.error("❌ Failed to connect to the database:", err);
      process.exit(1); // Exit if DB connection fails
    }
  })();

afterAll(async () => {
    await sql.end();
    server.close();
});

describe("Express Server", () => {
    it("should return Hello from the backend! on GET /", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("Hello from the backend!");
    });

      it("should connect to Socket.io", (done) => {
        const socket = socketClient(`http://localhost:${process.env.PORT}`, {
            withCredentials: true,
            extraHeaders: {
              "Content-Type": "application/json",
            },
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true, // Enable reconnection
            reconnectionAttempts: Infinity, // Keep trying to reconnect
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
          expect(socket.connected).toBe(true);
          done();
        });

        socket.on("connect_error", (err) => {
          done(err);
        });

        socket.on("disconnect", () => {
          expect(socket.connected).toBe(false);
          done();
        });
      });

    it("should return 401 for /api/users", async () => {
        const res = await request(app).get("/api/users");
        expect(res.statusCode).toBe(401);
    });

    it("should return 404 with correct error message or 200 for /api/posts", async () => {
        const res = await request(app).get("/api/posts");
        if (res.statusCode === 200) {
            expect(res.statusCode).toBe(200);
        } else if (res.statusCode === 404) {
            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toBe("No posts found");
        } else {
            throw new Error(`Unexpected status code: ${res.statusCode}`);
        }
    });
});