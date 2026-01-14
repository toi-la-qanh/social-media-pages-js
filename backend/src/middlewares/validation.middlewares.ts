import { NextFunction, Request, Response } from 'express';
import { validationResult } from "express-validator";

export const validateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorKey = errors.array()[0].msg;

        return res.status(422).json({
            errors: req.t(errorKey),
        });
    }

    next();
};