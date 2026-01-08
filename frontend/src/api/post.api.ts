import BaseApi from "./base.api";

const url = `${import.meta.env.VITE_BACKEND_URL}/api/posts`; 

export default class PostApi extends BaseApi {
    /**
     * Get all posts
     */
    index(current_page: number = 1, total_pages: number = 10) {
        return super.get(`${url}?current_page=${current_page}&total_pages=${total_pages}`);
    }

    /**
     * Create a new post
     */
    store(data: { content: string }) {
        return super.post(`${url}`, data);
    }

    /**
     * Get a post by id
     */
    show(id: string) {
        return super.get(`${url}/${id}`);
    }

    /**
     * Get replies of a post
     */
    showReplies(id: string) {
        return super.get(`${url}/${id}/replies`);
    }

    /**
     * Update a post by id
     */
    update(id: string, data: { content: string }) {
        return super.patch(`${url}/${id}`, data);
    }

    /**
     * Delete a post by id
     */
    destroy(id: string) {
        return super.delete(`${url}/${id}`);
    }

    /**
     * Get count of replies of a post
     */
    getCountOfReplies(id: string) {
        return super.get(`${url}/${id}/replies/count`);
    }

    /**
     * Create a new reply
     */
    createReply(id: string, data: { content: string }) {
        return super.post(`${url}/${id}/replies`, data);
    }

    /**
     * Get all posts of a user
     */
    getUserPosts(username: string) {
        return super.get(`${url}/users/${username}/posts`);
    }

    /**
     * Get all replies of a user
     */
    getUserReplies(username: string) {
        return super.get(`${url}/users/${username}/replies`);
    }
}