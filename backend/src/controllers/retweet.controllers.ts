import { Request, Response } from "express";
import sql from "../database/config/postgres";
import { Retweet, NewRetweet } from "../models/retweet.models";
import { Server, Socket } from "socket.io";
import { postHashids, userHashids } from "../utils/hashids";

export default class RetweetController {
    /**
     * Create a new retweet
     * @param req.params.post_id - Post ID
     */
    static async create(req: Request, res: Response) {
        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if(!postID) {
            return res.status(400).json({ errors: req.t('controllers.post.errors.invalidID') });
        }

        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if(!userID) {
            return res.status(400).json({ errors: req.t('controllers.user.errors.invalidID') });
        }
        
        // Add new retweet into database
        await sql<NewRetweet[]>`
        INSERT INTO retweets(post_id, user_id) 
        VALUES (${postID}, ${userID})`;

        return res.status(200).json([]);
    }

    /**
     * Delete a retweet
     * @param req.params.id - Post ID
     */
    static async destroy(req: Request, res: Response) {
        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;

        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;

        // Delete retweet from database
        const deleted = await sql<Retweet[]>`
        DELETE FROM retweets
        WHERE post_id = ${postID} AND user_id = ${userID}`;

        // Check if retweet exists
        if (deleted.length === 0) {
            return res.status(404).json({ errors: req.t('controllers.retweet.errors.notFound') });
        }

        return res.status(200).json([]);
    }

    /**
     * Get count of retweets of a post
     * @param req.params.post_id - Post ID
     */
    static async count(req: Request, res: Response) {
        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if(!postID) {
            return res.status(400).json({ errors: req.t('controllers.post.errors.invalidID') });
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
        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.params.id as string)[0] as number;
        if(!userID) {
            return res.status(400).json({ errors: req.t('controllers.user.errors.invalidID') });
        }

        // Get pagination parameters, default to page 1 and limit 10
        const page = parseInt(req.query.current_page as string) || 1;
        const limit = parseInt(req.query.total_pages as string) || 10;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Get all retweets from database
        const retweets = await sql<Retweet[]>`
        SELECT r.post_id AS post_id,
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
            return res.status(200).json([]);
        }

        // Encode IDs for each retweet post
        const retweetsWithEncodedIds = retweets.map(retweet => ({
            ...retweet,
            post_id: postHashids.encode(retweet.post_id),
            author_id: userHashids.encode(retweet.user_id)
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