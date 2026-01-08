// import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import socket from "./socket";
import LikeController from "../controllers/like.controllers";
import PostController from "../controllers/post.controllers";

class SocketController {
    private io: Server;

    constructor(server: HttpServer) {
        if (!server) {
            throw new Error(
                "Server instance is required to initialize SocketController"
            );
        }
        this.io = socket.init(server);
        this.setupSocketHandlers();
    }

     private setupSocketHandlers(): void {
         this.io.on("connection", (socket: Socket) => {
            console.log("User connected:", socket.id);
            this.setUpLikeEvents(socket);
            this.setUpPostEvents(socket);
            socket.on("disconnect", (reason: string) => {
                console.log(`User ${socket.id} has disconnected because ${reason}`);
            });
        });
    }

     setUpLikeEvents(socket: Socket) {
        LikeController.listenForEvents(this.io, socket);
    }

     setUpPostEvents(socket: Socket) {
        PostController.listenForEvents(this.io, socket);
    }
}

export default SocketController;
