import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns The response object
 * @throws {401} If the user is not authenticated
 * @throws {403} If the token is invalid
 */
export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ errors: "User not authenticated" });
  }

  jwt.verify(token, process.env.TOKEN_KEY as any, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ errors: "Token invalid" });
    }
    
    req.user = decoded.id; // Store user_id in request for later use
    next();
  });
};