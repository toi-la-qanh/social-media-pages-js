import request from "supertest";
import { describe, it, expect, afterAll, beforeAll } from "@jest/globals";
import socketClient from "socket.io-client";

import { app, server } from "../src/index";
import sql from "../src/database/config/postgres";

import { UserTest } from "./user.test";
import { PostTest } from "./post.test";
import { FollowTest } from "./follow.test";
import { LikeTest } from "./like.test";
import { RetweetTest } from "./retweet.test";

beforeAll(async () => {
  try {
    // Example query to test the connection
    await sql`SELECT 1`;
    console.log("✅ Database connected");

  } catch (err) {
    console.error("❌ Failed to connect to the database:", err);
    process.exit(1); // Exit if DB connection fails
  }
});

afterAll(async () => {
  await sql.end();
  server.close();
});

describe("Express Server", () => {
  it("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("should connect to Socket.io", (done) => {
    const PORT = 5000;
    const socket = socketClient(`http://localhost:${PORT}`, {
      withCredentials: true,
      extraHeaders: {
        "Content-Type": "application/json",
      },
      transports: ["websocket"],
      autoConnect: true,
      reconnection: false,
    });

    socket.on("connect", () => {
      expect(socket.connected).toBe(true);
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      expect(socket.connected).toBe(false);
      done();
    });

    socket.on("connect_error", (err) => {
      done(err);
    });
  });
});

UserTest.register(app);
PostTest.register(app);
FollowTest.register(app);
LikeTest.register(app);
RetweetTest.register(app);
