import BaseApi from "./base.api";
import { language } from "../store";
const url = `${import.meta.env.VITE_BACKEND_URL}/api/posts`; 

export default class LikeApi extends BaseApi {
    /**
     * Like a post
     */
    store(post_id: string) {
        return super.post(`${url}/${post_id}/likes`, {}, { lang: language.value });
    }

    /**
     * Unlike a post
     */
    destroy(post_id: string) {
        return super.delete(`${url}/${post_id}/likes`, { lang: language.value });
    }

    /**
     * Get likes of a post
     */
    getLikesOfPost(post_id: string) {
        return super.get(`${url}/${post_id}/likes`, { lang: language.value });
    }

    /**
     * Check if current user has liked this post
     */
    checkIfLiked(post_id: string) {
        return super.get(`${url}/${post_id}/likes/me`, { lang: language.value });
    }
}