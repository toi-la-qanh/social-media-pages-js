import BaseApi from "./base.api";

const url = `${import.meta.env.VITE_BACKEND_URL}/api/posts`;

export default class RetweetApi extends BaseApi {
    /**
     * Retweet a post
     */
    store(post_id: string) {
        return super.post(`${url}/${post_id}/retweets`, {});
    }

    /**
     * Delete a retweet
     */
    destroy(post_id: string) {
        return super.delete(`${url}/${post_id}/retweets`);
    }

    /**
     * Get count of retweets of a post
     */
    getCountOfRetweets(post_id: string) {
        return super.get(`${url}/${post_id}/retweets/count`);
    }

    /**
     * Get all retweet posts of a user
     */
    getRetweetPostsOfUser(user_id: string, current_page: number = 1, total_pages: number = 10) {
        return super.get(`${url}/users/${user_id}/retweets?current_page=${current_page}&total_pages=${total_pages}`);
    }
}