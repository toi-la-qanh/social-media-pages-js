import { Request, Response } from "express";
import { param, validationResult, query } from "express-validator";
import sql from "../database/config/postgres";
import Hashids from 'hashids'
import { Retweet, NewRetweet } from "../models/retweet.models";
import { Server, Socket } from "socket.io";
const hashids = new Hashids('Post', 10);

export default class RetweetController {
    /**
     * Create a new retweet
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
        const postID = hashids.decode(req.params.post_id as string)[0] as number;
        if(!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Decode user ID to get the actual ID
        const userID = hashids.decode(req.user as string)[0] as number;
        if(!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }
        
        // Add new retweet into database
        await sql<NewRetweet[]>`
        INSERT INTO retweets(post_id, user_id) 
        VALUES (${postID}, ${userID})`;

        return res.status(200).json({ message: 'Retweet created successfully' });
    }

    /**
     * Delete a retweet
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
        const postID = hashids.decode(req.params.post_id as string)[0] as number;

        // Decode user ID to get the actual ID
        const userID = hashids.decode(req.user as string)[0] as number;

        // Delete retweet from database
        const deleted = await sql<Retweet[]>`
        DELETE FROM retweets
        WHERE post_id = ${postID} AND user_id = ${userID}`;

        // Check if retweet exists
        if (deleted.length === 0) {
            return res.status(404).json({ error: 'Retweet not found' });
        }

        return res.status(200).json({ message: 'Retweet deleted successfully' });
    }

    /**
     * Get count of retweets of a post
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
        const postID = hashids.decode(req.params.post_id as string)[0] as number;
        if(!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Get count of retweets from database
        const count = await sql<Retweet[]>`
        SELECT COUNT(id)::int 
        FROM retweets 
        WHERE post_id = ${postID}`;

        return res.status(200).json(count[0]);
    }

    /**
     * Get all retweet posts of this user
     * @returns All retweet posts of this user
     */
    static async index(req: Request, res: Response) {
        // Validate user ID
        await param('user_id')
            .notEmpty()
            .withMessage('User ID is required')
            .run(req);

        // Validate current page
        await query('current_page')
            .notEmpty()
            .withMessage('Current page is required')
            .run(req);

        // Validate total pages
        await query('total_pages')
            .notEmpty()
            .withMessage('Total pages is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode user ID to get the actual ID
        const userID = hashids.decode(req.params.user_id as string)[0] as number;
        if(!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }

        // Get pagination parameters, default to page 1 and limit 10
        const page = parseInt(req.query.current_page as string) || 1;
        const limit = parseInt(req.query.total_pages as string) || 10;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Get all retweets from database
        const retweets = await sql<Retweet[]>`
        SELECT r.post_id AS post_id,
               p.title,
               p.content,
               p.image_url,
               p.views,
               p.user_id   AS author_id,
               u.name      AS author_name,
               u.image_url AS author_image_url
        FROM retweets r
        JOIN posts p ON p.id = r.post_id
        JOIN users u ON u.id = p.user_id
        WHERE r.user_id = ${userID}
        ORDER BY r.created_at DESC
        LIMIT ${limit} OFFSET ${offset}`;

        // Check if there are any retweets
        if (!retweets || retweets.length === 0) {
            return res.status(200).json({ message: 'You don\'t have any retweet posts' });
        }

        // Encode IDs for each retweet post
        const retweetsWithEncodedIds = retweets.map(retweet => ({
            ...retweet,
            post_id: hashids.encode(retweet.post_id),
            author_id: hashids.encode(retweet.user_id)
        }));

        return res.status(200).json(retweetsWithEncodedIds);
    }

    /**
     * Retweet, Unretweet events listener
     * @param io 
     * @param socket 
     */
    static async listenForEvents(io: Server, socket: Socket) {
        socket.on('retweet', (postID: string) => {
            console.log('A user retweeted a post', postID);

            // Emit retweet event to all connected clients
            io.emit('retweet', postID);
        });
        socket.on('unretweet', (postID: string) => {
            console.log('A user unretweeted a post', postID);

            // Emit unretweet event to all connected clients
            io.emit('unretweet', postID);
        });
    }
}