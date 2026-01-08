import BaseApi from "./base.api";

const url = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

export default class FollowApi extends BaseApi {
    /**
     * Follow a user
     */
    store(user_id: string) {
        return super.post(`${url}/${user_id}/follow`, {});
    }

    /**
     * Unfollow a user
     */
    destroy(user_id: string) {
        return super.delete(`${url}/${user_id}/follow`);
    }

    /**
     * Check if current user is following this user
     */
    checkIfFollowing(user_id: string) {
        return super.get(`${url}/${user_id}/follow/me`);
    }

    /**
     * Get all followers of a user
     */
    getFollowers(user_id: string) {
        return super.get(`${url}/${user_id}/followers`);
    }

    /**
     * Get all following of a user
     */
    getFollowing(user_id: string) {
        return super.get(`${url}/${user_id}/following`);
    }
}