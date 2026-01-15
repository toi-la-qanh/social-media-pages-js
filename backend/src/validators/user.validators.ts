import { body, param, query } from "express-validator";

/**
 * Validation rules for user-related routes
 */
export class UserValidator {
    /** 
    * Validate user ID
    * @returns Validator
    */
    static id() {
        return param('id')
            .notEmpty()
            .withMessage('controllers.user.validation.id.required')
            .isString()
            .withMessage('controllers.user.validation.id.string')
    }

    /** 
    * Validate following ID
    * @returns Validator
    */
    static followingId() {
        return param('following_id')
            .notEmpty()
            .withMessage('controllers.follow.validation.following_id.required')
            .isString()
            .withMessage('controllers.follow.validation.following_id.string')
    }

    /** 
    * Validate follower ID
    * @returns Validator
    */
    static followerId() {
        return param('follower_id')
            .notEmpty()
            .withMessage('controllers.follow.validation.follower_id.required')
            .isString()
            .withMessage('controllers.follow.validation.follower_id.string')
    }

    /** 
    * Validate email
    * @returns Validator
    */
    static email() {
        return body('email')
            .notEmpty()
            .withMessage('controllers.user.validation.email.required')
            .isString()
            .withMessage('controllers.user.validation.email.string')
            .matches(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/)
            .withMessage('controllers.user.validation.email.notValid');
    }

    /** 
    * Validate password
    * @returns Validator
    */
    static password() {
        return body('password')
            .notEmpty()
            .withMessage('controllers.user.validation.password.required')
            .isString()
            .withMessage('controllers.user.validation.password.string')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .withMessage('controllers.user.validation.password.notValid')
    }

    /** 
    * Validate password confirm
    * @returns Validator
    */
    static passwordConfirm() {
        return body('password_confirm')
            .isString()
            .withMessage('controllers.user.validation.password_confirm.string')
            .notEmpty()
            .withMessage('controllers.user.validation.password_confirm.required')
    }

    /** 
    * Validate full name
    * @returns Validator
    */
    static fullName() {
        return body('full_name')
            .notEmpty()
            .withMessage('controllers.user.validation.full_name.required')
            .isString()
            .withMessage('controllers.user.validation.full_name.string')
            .matches(/^[\p{L}\sà-ỹÀ-Ỵ].*$/u)
            .withMessage('controllers.user.validation.full_name.notValid');

    }

    /** 
    * Validate username
    * @returns Validator
    */
    static username() {
        return param('username')
            .notEmpty()
            .withMessage('controllers.user.validation.username.required')
            .isString()
            .withMessage('controllers.user.validation.username.string')
            .matches(/^(?=.{3,30}$)(?![._])(?!.*[._]{2})[a-zA-Z0-9._]+(?<![._])$/)
            .withMessage('controllers.user.validation.username.notValid');
    }

    /** 
    * Validate token
    * @returns Validator
    */
    static token() {
        return param('token')
            .notEmpty()
            .withMessage('controllers.user.validation.token.required')
            .isString()
            .withMessage('controllers.user.validation.token.string')
            .notEmpty()
            .withMessage('controllers.user.validation.token.required');
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