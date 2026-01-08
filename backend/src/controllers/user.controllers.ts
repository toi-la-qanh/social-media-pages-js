import { Request, Response } from "express";
import { body, validationResult, param } from "express-validator";
import sql from "../database/config/postgres";
import createSecretToken from "../auth/token";
import bcrypt from "bcrypt";
import { User, NewUser, UpdateUser } from "../models/user.models";
import { MailService } from "../services/mail.services";
import { userHashids } from "../utils/hashids";
import crypto from 'crypto';

export default class UserController {
    /** 
    * Create a new user
    * @param req.body.email - Email
    * @param req.body.name - Username
    * @param req.body.password - Password
    * @throws {400} If input is invalid
    */
    static async create(req: Request, res: Response) {
        // Validate email 
        await body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isString()
            .withMessage('Email must be a string')
            .matches(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/)
            .withMessage('Email not valid')
            .run(req);

        // Validate name
        await body('full_name')
            .notEmpty()
            .withMessage('Full name is required')
            .isString()
            .withMessage('Full name must be a string')
            .matches(/^[\p{L}\sà-ỹÀ-Ỵ].*$/u)
            .withMessage('Full name not valid')
            .run(req);

        await body('username')
            .notEmpty()
            .withMessage('Username is required')
            .isString()
            .withMessage('Username must be a string')
            .matches(/^(?=.{3,30}$)(?![._])(?!.*[._]{2})[a-zA-Z0-9._]+(?<![._])$/)
            .withMessage('Username not valid')
            .run(req);

        // Validate password
        await body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isString()
            .withMessage('Password must be a string')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .withMessage('Password must be at least 8 characters long and contain at least one letter and one number')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { email, full_name, username, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new user to database
        const user = await sql<NewUser[]>`
        INSERT INTO users(email, full_name, username, password) 
        VALUES (${email}, ${full_name}, ${username}, ${hashedPassword}) 
        RETURNING id`;

        // Hash the user ID
        const hashedId = userHashids.encode(user[0].id);
        if(!hashedId) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }

        // Create a new token with the hashed ID
        const token = createSecretToken(hashedId);

        // Store the token in cookie
        res.cookie("token", token, {
            path: "/", // Cookie is accessible from all paths
            expires: new Date(Date.now() + 604800000), // Cookie expires in 7 days
            secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            sameSite: process.env.sameSite as any, // Set to Lax when run on local
        });

        return res.status(200).json({ message: 'User created successfully' });
    }

    /**
     * Login a user
     * @param req.body.email - Email
     * @param req.body.password - Password
     * @throws {400} If input is invalid
     * @throws {404} If user not found
     * @throws {401} If password is not matching
     */
    static async login(req: Request, res: Response) {
        // Validate email
        await body('email')
            .notEmpty()
            .withMessage('Email is required')
            .run(req);

        // Validate password
        await body('password')
            .notEmpty()
            .withMessage('Password is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        // Get user data from database
        const userData = await sql<User[]>`
        SELECT id, password 
        FROM users 
        WHERE email = ${email}`;

        // Check if user exists
        if (userData.length === 0) {
            return res.status(404).json({ errors: 'User not found' });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, userData[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ errors: 'Invalid password' });
        }

        // Hash the user ID
        const hashedId = userHashids.encode(userData[0].id);
        if(!hashedId) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }
        // Create a new token with the hashed ID
        const token = createSecretToken(hashedId);

        // Clear previous token
        res.clearCookie("token");

        // Store the token in cookie
        res.cookie("token", token, {
            path: "/", // Cookie is accessible from all paths
            expires: new Date(Date.now() + 604800000), // Cookie expires in 7 days
            secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS
            httpOnly: true, // Cookie cannot be accessed via client-side scripts
            sameSite: process.env.sameSite as any, // Set to Lax when run on local
        });

        return res.status(200).json({ message: 'Login successful' });
    }

    /**
     * Logout a user
     */
    static async logout(req: Request, res: Response) {
        // Clear token from cookie
        res.clearCookie("token");

        // Return success message
        return res.status(200).json({ message: "Logged out successfully" });
    }

    /**
     * Delete a user
     * @throws {404} If user not found
     */
    static async delete(req: Request, res: Response) {
        // Decode user ID
        const decodedId = userHashids.decode(req.user as string)[0] as number;

        // Delete user from database
        const user = await sql<User[]>`
        DELETE FROM users 
        WHERE id = ${decodedId}`;

        // Check if user exists
        if (user.length === 0) {
            return res.status(404).json({ errors: 'User not found' });
        }

        // Clear token from cookie
        res.clearCookie("token");
        return res.status(200).json({ message: "User deleted successfully" });
    }

    /**
     * Get current user data
     * @param req.user - User ID
     * @returns User data { id: string, username: string, full_name: string, image_url: string }
     * @throws {400} If input is invalid
     * @throws {404} If user not found
     */
    static async getCurrentUser(req: Request, res: Response) {
        // Decode user ID
        const decodedId = userHashids.decode(req.user as string)[0] as number;
        if (!decodedId) {
            return res.status(400).json({ errors: 'Invalid user ID' });
        }
        // Get user data from database
        const userData = await sql<User[]>`
        SELECT username, email, image_url, full_name
        FROM users 
        WHERE id = ${decodedId}`;

        // Check if user exists
        if (userData.length === 0) {
            return res.status(404).json({ errors: 'User not found' });
        }

        return res.status(200).json({
            id: req.user,
            username: userData[0].username,
            full_name: userData[0].full_name,
            email: userData[0].email,
            image_url: userData[0].image_url
        });
    }

    /**
    * Get this user data
    * @param req.params.username - Username
    * @returns User data { id: string, username: string, full_name: string, image_url: string }
    * @throws {400} If input is invalid
    * @throws {404} If user not found
    */
    static async getUser(req: Request, res: Response) {
        await param('username')
            .notEmpty()
            .withMessage('Username is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { username } = req.params;
        
        const userData = await sql<User[]>`
            SELECT id, image_url, full_name
            FROM users 
            WHERE username = ${username}`;

        // Check if user exists
        if (userData.length === 0) {
            return res.status(404).json({ errors: 'User not found' });
        }

        return res.status(200).json({
            id: userHashids.encode(userData[0].id),
            username: username,
            full_name: userData[0].full_name,
            image_url: userData[0].image_url
        });
    }

    /**
     * Search users
     * @param req.body.query - Search query
     * @returns Arrays of users
     */
    static async search(req: Request, res: Response) {
        // Validate search query
        await body('query')
            .notEmpty()
            .withMessage('Query is required')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { query } = req.body;

        console.log(query);

        // Search users in database
        const users = await sql<User[]>`
        SELECT
            u.id,
            u.username,
            u.full_name,
            u.bio,
            u.image_url,
            COALESCE(COUNT(f.follower_id), 0) AS followers_count
        FROM users u
        LEFT JOIN follows f ON f.following_id = u.id
        WHERE u.username ILIKE ${`%${query}%`}
           OR u.full_name ILIKE ${`%${query}%`}
        GROUP BY u.id, u.username, u.full_name, u.bio, u.image_url
        ORDER BY followers_count DESC, u.username ASC
        LIMIT 10;`;

        if (!users || users.length === 0) {
            return res.status(200).json({ message: 'There are no users to show' });
        }

        // Encode IDs for each user
        const usersWithEncodedIds = users.map(user => ({
            ...user,
            id: userHashids.encode(user.id)
        }));

        return res.status(200).json(usersWithEncodedIds);
    }

    /**
     * Forgot password
     * @param req.body.email - Email
     */
    static async forgotPassword(req: Request, res: Response) {
        // Validate email
        await body('email')
            .notEmpty()
            .withMessage('Email is required')
            .matches(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/)
            .withMessage('Email not valid')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { email } = req.body;

        // Generate a random secure token
        const token = crypto.randomBytes(32).toString('base64url');

        // Update user with new token
        const user = await sql<UpdateUser[]>`
        UPDATE users
        SET reset_password_token = ${token},
            reset_password_expires = NOW() + INTERVAL '15 minutes'
        WHERE email = ${email}
        RETURNING email`;

        // Check if user exists
        if (user.length === 0) {
            return res.status(404).json({ errors: 'User not found' });
        }

        // Generate reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // Send email to user with password reset link
        const mail = {
            from: process.env.EMAIL_USER as string,
            to: user[0].email as string,
            subject: 'Password Reset',
            text: `Click the link to reset your password: ${resetLink}`,
            html: `<p>Click the link to reset your password: <br> <a href="${resetLink}">${resetLink}</a></p>`
        };
        await MailService.sendMail(mail);
        return res.status(200).json({ message: 'Reset link already sent to email' });
    }

    /**
     * Update new password
     * @param req.body.password - New password
     * @param req.body.password_confirm - Confirm new password
     * @param req.params.token - Reset password token
     */
    static async updatePassword(req: Request, res: Response) {
        // Validate token
        await param('token')
            .notEmpty()
            .withMessage('Token is required')
            .run(req);

        // Validate password
        await body('password')
            .notEmpty()
            .withMessage('Password is required')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
            .withMessage('Password must be at least 8 characters long and contain at least one letter and one number')
            .run(req);

        // Validate confirm password
        await body('password_confirm')
            .notEmpty()
            .withMessage('Password confirm is required')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
            .withMessage('Password confirm must be at least 8 characters long and contain at least one letter and one number')
            .run(req);

        // Show errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { password, password_confirm } = req.body;

        // Check if passwords match
        if (password !== password_confirm) {
            return res.status(400).json({ errors: 'Passwords do not match' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get user by token
        const token = req.params.token as string;
        const result = await sql<User[]>`
        UPDATE users
        SET password = ${hashedPassword},
            reset_password_token = NULL,
            reset_password_expires = NULL
        WHERE reset_password_token = ${token} 
        AND reset_password_expires > NOW()
    `;

        if (result.length === 0) {
            return res.status(404).json({ errors: 'Invalid or expired token' });
        }
        return res.status(200).json({ message: 'Password updated successfully' });
    }
}