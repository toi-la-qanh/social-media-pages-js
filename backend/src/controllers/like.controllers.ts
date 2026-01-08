import { Request, Response } from "express";
import { param, validationResult } from "express-validator";
import sql from "../database/config/postgres";
import { Like, NewLike } from "../models/like.models";
import { Server, Socket } from "socket.io";
import { userHashids, postHashids } from "../utils/hashids";

export default class LikeController {
    /**
     * Like a post/reply
     * @param req.params.post_id - Post ID
     */
    static async create(req: Request, res: Response) {
        // Validate post ID
        await param('post_id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.post_id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }
        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }

        // Add new like into database
        const like = await sql<NewLike[]>`
        INSERT INTO likes(post_id, user_id) 
        VALUES (${postID}, ${userID}) 
        ON CONFLICT (post_id, user_id) DO NOTHING`;

        // Check if like already exists
        if (like.length === 0) {
            return res.status(200).json({ message: 'You already liked this post' });
        }

        return res.status(200).json({ message: 'Like created successfully' });
    }

    /**
     * Unlike a post/reply
     * @param req.params.post_id - Post ID
     */
    static async destroy(req: Request, res: Response) {
        // Validate post ID
        await param('post_id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.post_id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }
        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }

        // Delete like from database
        const deleted = await sql<Like[]>`
            DELETE FROM likes
            WHERE post_id = ${postID} AND user_id = ${userID}`;

        return res.status(200).json({ message: 'Unlike post successfully' });
    }

    /**
    * Check if user has liked this post
    * @param req.params.post_id - Post ID
    * @returns True if user has liked this post, false otherwise
    */
    static async isLiked(req: Request, res: Response) {
        // Validate post ID
        await param('post_id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.post_id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
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
        // Validate post ID
        await param('post_id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.post_id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
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