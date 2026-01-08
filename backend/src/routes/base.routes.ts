import express from "express";

/**
 * Base class for all routes.
 * Provides common functionality for route classes
 */
export default abstract class BaseRoutes {
    protected router: express.Router;
    protected url: string;

    constructor(url: string) {
        this.router = express.Router();
        this.url = url;
        this.setupRoutes();
    }

    /**
     * Abstract method to be implemented by child classes.
     * Define your routes here
     */
    protected abstract setupRoutes(): void;

    /**
     * Get the router
     */
    getRouter(): express.Router {
        return this.router;
    }

    /**
     * Get the url
     */
    getUrl(): string {
        return this.url;
    }
}

