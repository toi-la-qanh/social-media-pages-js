import BaseApi from "./base.api";

const url = `${import.meta.env.VITE_BACKEND_URL}/api/users`; 

export default class UserApi extends BaseApi {
    /**
     * Get current user data
     */
    getUser() {
        return super.get(`${url}/me`);
    }

    /**
     * Get this user data
     */
    getThisUser(username: string) {
        return super.get(`${url}/profile/${username}`);
    }

    /**
     * Login a user
     */
    async login(data: { email: string, password: string }) {
        return super.post(`${url}/signin`, data);
    }

    /**
     * Register a new user
     */
    async register(data: { email: string, password: string, username: string, full_name: string }) {
        return super.post(`${url}/signup`, data);
    }

    /**
     * Logout a user
     */
    async logout() {
        return super.post(`${url}/logout`, {});
    }

    /**
     * Forgot password
     */
    async forgotPassword(data: { email: string }) {
        return super.post(`${url}/forgot-password`, data);
    }

    /**
     * Update password
     */
    async updatePassword(token: string, data: { password: string, password_confirm: string }) {
        return super.patch(`${url}/update-password/${token}`, data);
    }

    /**
     * Search users
     */
    async search(query: string) {
        return super.post(`${url}/search`, { query });
    }
}