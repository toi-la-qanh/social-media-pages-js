import { Request, Response } from "express";
import sql from "../database/config/postgres";
import { Follow, NewFollow } from "../models/follow.models";
import { userHashids } from "../utils/hashids";

export default class FollowController {
    /**
     * Follow a user
     * 
     * @returns A success message
     */
    static async create(req: Request, res: Response) {
        // Decode following ID to get the actual ID
        const followingID = userHashids.decode(req.params.following_id as string)[0] as number;
        if (Number.isNaN(followingID)) {
            return res.status(400).json({ errors: req.t('controllers.follow.errors.invalidFollowingID') });
        }

        // Decode follower ID to get the actual ID
        const followerID = userHashids.decode(req.user as string)[0] as number;
        if (Number.isNaN(followerID)) {
            return res.status(400).json({ errors: req.t('controllers.follow.errors.invalidFollowerID') });
        }

        // Add new follow into database
        await sql<NewFollow[]>`
        INSERT INTO follows(follower_id, following_id) 
        VALUES (${followerID}, ${followingID}) 
        ON CONFLICT (follower_id, following_id) DO NOTHING`;

        return res.status(200).json([]);
    }

    /**
     * Unfollow a user
     * 
     * @returns A success message or error if the user wasn't following
     */
    static async destroy(req: Request, res: Response) {
        // Decode following ID to get the actual ID
        const followingID = userHashids.decode(req.params.following_id as string)[0] as number;
        if (Number.isNaN(followingID)) {
            return res.status(400).json({ errors: req.t('controllers.follow.errors.invalidFollowingID') });
        }
        // Decode follower ID (current user) to get the actual ID
        const followerID = userHashids.decode(req.user as string)[0] as number;
        if (Number.isNaN(followerID)) {
            return res.status(400).json({ errors: req.t('controllers.follow.errors.invalidFollowerID') });
        }

        // Delete follow from database
        const deleted = await sql<Follow[]>`
        DELETE FROM follows
        WHERE follower_id = ${followerID} AND following_id = ${followingID}`;

        // Check if follow exists
        if (deleted.length === 0) {
            return res.status(404).json({ errors: req.t('controllers.follow.errors.notFollowing') });
        }

        return res.status(200).json([]);
    }

    /**
     * Checks whether current user is following this person.
     *
     * The target user is identified by the `following_id` route parameter.
     *
     * @returns An object containing a boolean indicating follow status
     */
    static async isFollowing(req: Request, res: Response) {
        // Decode following ID to get the actual ID
        const followingID = userHashids.decode(req.params.following_id as string)[0] as number;
        if (Number.isNaN(followingID)) {
            return res.status(400).json({ errors: req.t('controllers.follow.errors.invalidFollowingID') });
        }

        // Decode follower ID (current user) to get the actual ID
        const followerID = userHashids.decode(req.user as string)[0] as number;
        if (Number.isNaN(followerID)) {
            return res.status(400).json({ errors: req.t('controllers.follow.errors.invalidFollowerID') });
        }

        const isFollowing = await sql<Follow[]>`
        SELECT 1 FROM follows 
        WHERE follower_id = ${followerID} AND following_id = ${followingID} 
        LIMIT 1`;
        return res.status(200).json({ following: isFollowing.length > 0 });
    }

    /**
     * Get all people who are following this person.
     *
     * The target user is identified by the `id` route parameter.
     * Each follower includes basic profile information.
     *
     * @returns An array of followers
     */
    static async getFollowers(req: Request, res: Response) {
        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.params.id as string)[0] as number;

        // Get all followers of the user
        const followers = await sql<Follow[]>`
        SELECT f.follower_id,
               COUNT(f.follower_id) OVER (PARTITION BY f.following_id) AS followers_count,
               u.username AS follower_name,
               u.image_url AS follower_image_url
        FROM follows f
        JOIN users u ON u.id = f.follower_id
        WHERE f.following_id = ${userID}
        ORDER BY f.created_at DESC
        `;

        if (!followers || followers.length === 0) {
            return res.status(200).json([]);
        }

        // Encode IDs for each follower
        const followersWithEncodedIds = followers.map(follower => ({
            ...follower,
            follower_id: userHashids.encode(follower.follower_id)
        }));

        return res.status(200).json(followersWithEncodedIds);
    }

    /**
     * Get all people whom this person is following.
     *
     * The target user is identified by the `id` route parameter.
     * Each following includes basic profile information.
     *
     * @returns An array of following
     */
    static async getFollowing(req: Request, res: Response) {
        // Decode user ID to get the actual ID
        const userID = userHashids.decode(req.params.id as string)[0] as number;

        // Get all following of the user
        const following = await sql<Follow[]>`
        SELECT f.following_id,
               COUNT(f.following_id) OVER (PARTITION BY f.follower_id) AS following_count,
               u.username AS following_name,
               u.image_url AS following_image_url
        FROM follows f
        JOIN users u ON u.id = f.following_id
        WHERE f.follower_id = ${userID}
        ORDER BY f.created_at DESC
    `;

        if (!following || following.length === 0) {
            return res.status(200).json([]);
        }

        // Encode IDs for each following
        const followingWithEncodedIds = following.map(following => ({
            ...following,
            following_id: userHashids.encode(following.following_id)
        }));

        return res.status(200).json(followingWithEncodedIds);
    }
}