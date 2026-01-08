import { Request, Response } from "express";
import { param, body, query, validationResult } from "express-validator";
import sql from "../database/config/postgres";
import { Post, NewPost, UpdatePost } from "../models/post.models";
import { Server, Socket } from "socket.io";
import { postHashids, userHashids } from "../utils/hashids";
import { format, differenceInHours } from 'date-fns';

export default class PostController {
    /**
     * Get all posts
     * @param req.query.current_page - Current page number, default to 1
     * @param req.query.total_pages - Total number of pages, default to 10
     * @returns All posts
     */
    static async index(req: Request, res: Response) {
        // Validate current page
        await query('current_page')
            .optional()
            .run(req);

        // Validate total pages
        await query('total_pages')
            .optional()
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Get pagination parameters, default to page 1 and limit 10
        const page = parseInt(req.query.current_page as string) || 1;
        const limit = parseInt(req.query.total_pages as string) || 10;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Get all posts from database
        const posts = await sql<Post[]>
            `SELECT
                p.id,
                p.parent_id,
                p.content,
                p.image_url,
                p.views,
                p.created_at,
                p.user_id            AS author_id,
                u.username           AS author_name,
                u.image_url          AS author_image_url,
                parent_p.user_id     AS reply_to_user_id,
                parent_u.username    AS reply_to_user_name,
                r.user_id            AS retweet_user_id,
                ru.username          AS retweet_user_name

            FROM posts p
            JOIN users u 
                ON u.id = p.user_id

            LEFT JOIN retweets r
                ON r.post_id = p.id

            LEFT JOIN users ru
                ON ru.id = r.user_id

            LEFT JOIN posts parent_p
                ON parent_p.id = p.parent_id

            LEFT JOIN users parent_u
                ON parent_u.id = parent_p.user_id

            ORDER BY p.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
            `;

        // Check if there are any posts
        if (!posts || posts.length === 0) {
            return res.status(404).json({ errors: 'No posts found' });
        }

        // Encode IDs for each post
        const postsWithEncodedIds = posts.map(post => {
            const createdAt = new Date(post.created_at);
            const hoursDifference = differenceInHours(new Date(), createdAt);

            let formattedDate;
            if (hoursDifference < 24) {
                // If it's less than 24 hours, show relative time (e.g., "23h")
                formattedDate = `${hoursDifference}h`;
            } else {
                // Otherwise, show the full date (DD/MM/YY)
                formattedDate = format(createdAt, 'dd/MM/yy');
            }

            return {
                ...post,
                created_at: formattedDate,
                id: postHashids.encode(post.id),
                author_id: userHashids.encode(post.author_id),
                reply_to_user_id: post.reply_to_user_id
                    ? userHashids.encode(post.reply_to_user_id)
                    : null,

                retweet_user_id: post.retweet_user_id
                    ? userHashids.encode(post.retweet_user_id)
                    : null
            };
        });

        return res.status(200).json(postsWithEncodedIds);
    }

    /**
     * Get data of a post
     * @param req.params.id - Post ID
     * @returns Post data
     */
    static async show(req: Request, res: Response) {
        // Validate post ID
        await param('id')
            .notEmpty()
            .withMessage('Post ID is required')
            .isString()
            .withMessage('Post ID must be a string')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }
        //await sql<Post[]>`UPDATE posts SET views = views + 1 WHERE id = ${postID}`;

        // Get post data from database
        const post = await sql<Post[]>`SELECT 
            p.id,
            p.parent_id,
            p.content,
            p.image_url,
            p.views,
            p.created_at,
            p.user_id       AS author_id,
            u.username      AS author_name,
            u.image_url     AS author_image_url
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.id = ${postID}`;

        // Check if post exists
        if (!post || post.length === 0) {
            return res.status(404).json({ errors: 'Post not found' });
        }

        const createdAt = new Date(post[0].created_at);
        const hoursDifference = differenceInHours(new Date(), createdAt);

        let formattedDate;
        if (hoursDifference < 24) {
            // If it's less than 24 hours, show relative time (e.g., "23h")
            formattedDate = `${hoursDifference}h`;
        } else {
            // Otherwise, show the full date (DD/MM/YY)
            formattedDate = format(createdAt, 'dd/MM/yy');
        }
        // Encode ID for the post
        const postWithEncodedId = {
            ...post[0],
            created_at: formattedDate,
            id: postHashids.encode(post[0].id),
            author_id: userHashids.encode(post[0].author_id),
            parent_id: post[0].parent_id ? postHashids.encode(post[0].parent_id) : null
        };

        return res.status(200).json(postWithEncodedId);
    }

    /**
     * Create a new post
     * @param req.body.content - Post's content
     * @param req.body.image_url - Image URL (optional)
     */
    static async create(req: Request, res: Response) {
        // Validate content
        await body('content')
            .notEmpty()
            .withMessage('Content is required')
            .isLength({ min: 50, max: 1000 })
            .withMessage('Content must be between 50 and 1000 characters')
            .run(req);

        // Validate image URL
        await body('image_url')
            .optional()
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { content, image_url = null } = req.body;

        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }

        // Add new post into database
        await sql<NewPost[]>`
        INSERT INTO posts(content, image_url, user_id) 
        VALUES (${content}, ${image_url}, ${userID})`;

        return res.status(200).json({ message: 'Post created successfully' });
    }

    /**
     * Update a post
     * @param req.params.id - Post ID
     * @param req.body.content - Post content
     * @param req.body.image_url - Post image
     */
    static async update(req: Request, res: Response) {
        // Validate post ID
        await param('id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Validate content
        await body('content')
            .optional()
            .isLength({ min: 50, max: 1000 })
            .withMessage('Content must be between 50 and 1000 characters')
            .run(req);

        // Validate image URL
        await body('image_url')
            .optional()
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { content, image_url } = req.body;

        // If no data is provided to update, no need to run the query
        if (!content && !image_url) {
            return res.status(200).json({ message: 'No data to update' });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Get current post data
        const currentPost = await sql<Post[]>`
        SELECT content, image_url 
        FROM posts 
        WHERE id = ${postID}`;

        // Check if post exists
        if (currentPost.length === 0) {
            return res.status(404).json({ errors: 'Post not found' });
        }

        // Update post only if data is provided
        await sql<UpdatePost[]>`
        UPDATE posts 
        SET content = ${content || currentPost[0].content}, 
            image_url = ${image_url || currentPost[0].image_url} 
        WHERE id = ${currentPost[0].id}`;

        return res.status(200).json({ message: 'Post updated successfully' });
    }

    /**
     * Delete a post
     * @param req.params.id - Post ID
     */
    static async destroy(req: Request, res: Response) {
        // Validate post ID
        await param('id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Delete post from database
        const post = await sql<Post[]>`DELETE FROM posts 
        WHERE id = ${postID}`;

        // Check if post exists
        if (post.length === 0) {
            return res.status(404).json({ errors: 'Post not found' });
        }

        return res.status(200).json({ message: 'Post deleted successfully' });
    }

    /**
     * Get count of replies of a post
     * @param req.params.id - Post ID
     * @returns Count of replies of a post
     */
    static async getCountOfReplies(req: Request, res: Response) {
        // Validate post ID
        await param('id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Get count of replies from database
        const replies = await sql<Post[]>`SELECT COUNT(id)::int 
        FROM posts 
        WHERE parent_id = ${postID}`;

        // If there are no replies, return 0
        if (!replies || replies.length === 0) {
            return res.status(200).json(0);
        }

        return res.status(200).json(replies[0]);
    }

    /**
    * Show replies of a post
    * @param req.params.id - Post ID
    * @returns Replies of a post
    */
    static async showReplies(req: Request, res: Response) {
        // Validate reply ID
        await param('id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode reply ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Get replies from database 
        const replies = await sql<Post[]>`SELECT 
                p.id,
                p.parent_id,    
                p.content,
                p.views,
                p.created_at,
                p.user_id       AS author_id,
                u.username      AS author_name,
                u.image_url     AS author_image_url
                FROM posts p
                JOIN users u ON u.id = p.user_id
                WHERE p.parent_id = ${postID}`;

        // Check if there are any replies
        if (!replies || replies.length === 0) {
            return res.status(200).json({ message: 'There are no replies yet' });
        }

        // Encode IDs for each reply
        const repliesWithEncodedIds = replies.map(reply => {
            const createdAt = new Date(reply.created_at);
            const hoursDifference = differenceInHours(new Date(), createdAt);

            let formattedDate;
            if (hoursDifference < 24) {
                // If it's less than 24 hours, show relative time (e.g., "23h")
                formattedDate = `${hoursDifference}h`;
            } else {
                // Otherwise, show the full date (DD/MM/YY)
                formattedDate = format(createdAt, 'dd/MM/yy');
            }

            return {
                ...reply,
                created_at: formattedDate,
                id: postHashids.encode(reply.id),
                author_id: userHashids.encode(reply.author_id)
            };
        });

        return res.status(200).json(repliesWithEncodedIds);
    }

    /**
     * Create a new reply
     * @param req.params.id - Post ID
     * @param req.body.content - Reply content
     * @param req.body.image_url - Reply image URL (optional)
     */
    static async createReply(req: Request, res: Response) {
        // Validate post ID
        await param('id')
            .notEmpty()
            .withMessage('Post ID is required')
            .run(req);

        // Validate content
        await body('content')
            .notEmpty()
            .withMessage('Content is required')
            .isLength({ min: 50, max: 1000 })
            .withMessage('Content must be between 50 and 1000 characters')
            .run(req);

        // Validate image URL
        await body('image_url')
            .optional()
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { content, image_url } = req.body;

        // Decode post ID to get the actual ID
        const postID = postHashids.decode(req.params.id as string)[0] as number;
        if (!postID) {
            return res.status(400).json({ errors: 'Invalid post ID' });
        }

        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.user as string)[0] as number;
        if (!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }

        // Add new reply into database
        await sql<NewPost[]>`
        INSERT INTO posts(content, image_url, user_id) 
        VALUES (${content}, ${image_url}, ${userID})
        WHERE parent_id = ${postID}`;

        return res.status(200).json({ message: 'Reply created successfully' });
    }

    /**
    * Get all posts of this person
    * @returns Post data
    */
    static async getUserPosts(req: Request, res: Response) {
        // Validate username
        await param('username')
            .notEmpty()
            .withMessage('Username is required')
            .isString()
            .withMessage('Username must be a string')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const username = req.params.username as string;

        // Get post data from database
        const posts = await sql<Post[]>`SELECT 
                p.id,
                p.parent_id,
                p.content,
                p.image_url,
                p.views,
                p.created_at,
                p.user_id       AS author_id,
                u.username      AS author_name,
                u.image_url     AS author_image_url
                FROM posts p
                JOIN users u ON u.id = p.user_id
                WHERE u.username = ${username} AND p.parent_id IS NULL
                ORDER BY p.created_at DESC`;

        // Check if post exists
        if (!posts || posts.length === 0) {
            return res.status(200).json([]);
        }

        // Format each post
        const postsWithFormattedDate = posts.map(post => {
            const createdAt = new Date(post.created_at);
            const hoursDifference = differenceInHours(new Date(), createdAt);

            let formattedDate;
            if (hoursDifference < 24) {
                // If it's less than 24 hours, show relative time (e.g., "23h")
                formattedDate = `${hoursDifference}h`;
            } else {
                // Otherwise, show the full date (DD/MM/YY)
                formattedDate = format(createdAt, 'dd/MM/yy');
            }

            return {
                ...post,
                created_at: formattedDate,
                id: postHashids.encode(post.id),
                author_id: userHashids.encode(post.author_id),
                parent_id: post.parent_id ? postHashids.encode(post.parent_id) : null
            };
        })

        return res.status(200).json(postsWithFormattedDate);
    }

    /**
    * Get all replies of this person
    * @returns Replies data
    */
    static async getUserReplies(req: Request, res: Response) {
        // Validate username
        await param('username')
            .notEmpty()
            .withMessage('Username is required')
            .isString()
            .withMessage('Username must be a string')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        // Decode post ID to get the actual ID
        const username = req.params.username as string;

        // Get post data from database
        const posts = await sql<Post[]>`SELECT 
                    p.id,
                    p.parent_id,
                    p.content,
                    p.image_url,
                    p.views,
                    p.created_at,
                    p.user_id       AS author_id,
                    u.username      AS author_name,
                    u.image_url     AS author_image_url
                    FROM posts p
                    JOIN users u ON u.id = p.user_id
                    WHERE u.username = ${username} AND p.parent_id IS NOT NULL
                    ORDER BY p.created_at DESC`;

        // Check if post exists
        if (!posts || posts.length === 0) {
            return res.status(200).json([]);
        }

        // Format each post
        const postsWithFormattedDate = posts.map(post => {
            const createdAt = new Date(post.created_at);
            const hoursDifference = differenceInHours(new Date(), createdAt);

            let formattedDate;
            if (hoursDifference < 24) {
                // If it's less than 24 hours, show relative time (e.g., "23h")
                formattedDate = `${hoursDifference}h`;
            } else {
                // Otherwise, show the full date (DD/MM/YY)
                formattedDate = format(createdAt, 'dd/MM/yy');
            }

            return {
                ...post,
                created_at: formattedDate,
                id: postHashids.encode(post.id),
                author_id: userHashids.encode(post.author_id),
                parent_id: post.parent_id ? postHashids.encode(post.parent_id) : null
            };
        })

        return res.status(200).json(postsWithFormattedDate);
    }

    /**
     * Replies count events listener
     * @param io 
     * @param socket 
     */
    static async listenForEvents(io: Server, socket: Socket) {
        socket.on('reply', (replyID: string) => {
            console.log('A user posted a new post', replyID);

            // Emit reply event to all connected clients
            io.emit('reply', replyID);
        });
        socket.on('unreply', (replyID: string) => {
            console.log('A user unreplied to a post', replyID);

            // Emit unreply event to all connected clients
            io.emit('unreply', replyID);
        });
    }
}