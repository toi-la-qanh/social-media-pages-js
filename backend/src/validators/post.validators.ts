import { body, param, query } from "express-validator";

/**
 * Validation rules for post-related routes
 */
export class PostValidator {
    /** 
    * Validate post ID
    * @returns Validator
    */
    static id() {
        return param('id')
            .notEmpty()
            .withMessage('controllers.post.validation.id.required')
            .isString()
            .withMessage('controllers.post.validation.id.string')
    }

    /** 
    * Validate content
    * @returns Validator
    */
    static content() {
        return body('content')
            .notEmpty()
            .withMessage('controllers.post.validation.content.required')
            .isString()
            .withMessage('controllers.post.validation.content.string')
            .isLength({ min: 10, max: 1000 })
            .withMessage('controllers.post.validation.content.length');
    }

    /** 
    * Validate query
    * @returns Validator
    */
    static query() {
        return query('q')
            .notEmpty()
            .withMessage('controllers.user.validation.query.required')
            .isString()
            .withMessage('controllers.user.validation.query.string')
            .notEmpty()
            .withMessage('controllers.user.validation.query.required');
    }
}