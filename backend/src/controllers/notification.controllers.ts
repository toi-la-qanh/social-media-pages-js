import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Notification, NewNotification, UpdateNotification } from "../models/notification.models";
import sql from "../database/config/postgres";
import Hashids from 'hashids';
const hashids = new Hashids();

export default class NotificationController {
    /**
     * Create a new notification
     * @param req.body.type - Notification type
     * @param req.body.message - Notification message
     * @param req.body.data - Notification data
     * @returns Notification
     */
    static async create(req: Request, res: Response) {
        // Validate type
        await body('type')
            .notEmpty()
            .withMessage('Type is required')
            .run(req);

        // Validate message
        await body('message')
            .notEmpty()
            .withMessage('Message is required')
            .run(req);

        // Validate data
        await body('data')
            .optional()
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
        
        // Add new notification into database
        const { type, message, data } = req.body;
        const notification = await sql<NewNotification[]>`
        INSERT INTO notifications(user_id, type, message, data) 
        VALUES (${userID}, ${type}, ${message}, ${data}) 
        RETURNING id`;

        // Check if notification was created
        if (notification.length === 0) {
            return res.status(400).json({ errors: 'Failed to create notification' });
        }
        return res.status(200).json(notification);
    }

    /**
     * Get all notifications for a user
     * @param req.user - User ID
     * @returns All notifications
     */
    static async index(req: Request, res: Response) {
        // Decode user ID to get the actual ID
        const userID = hashids.decode(req.user as string)[0] as number;
        if(!userID) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }

        // Get all notifications for the user
        const notifications = await sql<Notification[]>`
        SELECT * FROM notifications WHERE user_id = ${userID}`;

        return res.status(200).json(notifications);
    }
}