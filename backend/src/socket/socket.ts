import { Server } from "socket.io";
let io: Server | null = null;
export default {
  /**
   * Initialize the Socket.IO server
   * @param server - The server instance
   * @returns The Socket.IO server instance
   * @throws {Error} If the server instance is not provided
   */
  init: (server: any) => {
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      },
    });
    return io;
  },
  
  /**
   * Get the Socket.IO server instance
   * @returns The Socket.IO server instance
   * @throws {Error} If the Socket.io is not initialized
   */
  getIO: (): Server => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};