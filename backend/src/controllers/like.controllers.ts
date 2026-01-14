import { Request, Response } from "express";
import sql from "../database/config/postgres";
import { Like, NewLike } from "../models/like.models";
import { Server, Socket } from "socket.io";
import { userHashids, postHashids } from "../utils/hashids";

export default class LikeController {
    /**
     * Like a post/reply
     */
    static async create(req: Request, res: Response) {
        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: req.t('controllers.post.errors.invalidID') });
        }
        
        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: req.t('controllers.user.errors.invalidID') });
        }

        // Add new like into database
        await sql<NewLike[]>`
        INSERT INTO likes(post_id, user_id) 
        VALUES (${postID}, ${userID}) 
        ON CONFLICT (post_id, user_id) DO NOTHING`;

        return res.status(200).json([]);
    }

    /**
     * Unlike a post/reply
     * @param req.params.post_id - Post ID
     */
    static async destroy(req: Request, res: Response) {
        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: req.t('controllers.post.errors.invalidID') });
        }
        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: req.t('controllers.user.errors.invalidID') });
        }

        // Delete like from database
        await sql<Like[]>`
            DELETE FROM likes
            WHERE post_id = ${postID} AND user_id = ${userID}`;

        return res.status(200).json([]);
    }

    /**
    * Check if user has liked this post
    * @param req.params.post_id - Post ID
    * @returns True if user has liked this post, false otherwise
    */
    static async isLiked(req: Request, res: Response) {
        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: req.t('controllers.post.errors.invalidID') });
        }

        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: req.t('controllers.user.errors.invalidID') });
        }

        const isLiked = await sql<Like[]>`
        SELECT 1 FROM likes 
        WHERE user_id = ${userID} AND post_id = ${postID} 
        LIMIT 1`;
        return res.status(200).json({ liked: isLiked.length > 0 });
    }

    /**
     * Count likes of a post/reply
     * @param req.params.post_id - Post ID
     */
    static async count(req: Request, res: Response) {
        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: req.t('controllers.post.errors.invalidID') });
        }

        // Get count of likes from database
        const count = await sql<Like[]>`
            SELECT COUNT(id)::int FROM likes
            WHERE post_id = ${postID}
        `;

        return res.status(200).json(count[0]);
    }

    /**
     * Like, Dislike events listener
     */
    static async listenForEvents(io: Server, socket: Socket) {
        socket.on('like', (postID: string) => {
            console.log('A user liked a post', postID);

            // Emit like event to all connected clients
            socket.broadcast.emit('like', postID);
        });
        socket.on('unlike', (postID: string) => {
            console.log('A user unliked a post', postID);

            // Emit unlike event to all connected clients
            socket.broadcast.emit('unlike', postID);
        });
    }
}