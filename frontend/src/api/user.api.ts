import BaseApi from "./base.api";
import { language } from "../store.ts";
const url = `${import.meta.env.VITE_BACKEND_URL}/api/users`; 

export default class UserApi extends BaseApi {
    /**
     * Get current user data
     */
    getUser() {
        return super.get(`${url}/me`, { lang: language.value });
    }

    /**
     * Get this user data
     */
    getThisUser(username: string) {
        return super.get(`${url}/profile/${username}`, { lang: language.value });
    }

    /**
     * Login a user
     */
    async login(data: { email: string, password: string }) {
        return super.post(`${url}/signin`, data, { lang: language.value });
    }

    /**
     * Register a new user
     */
    async register(data: { email: string, password: string, username: string, full_name: string }) {
        return super.post(`${url}/signup`, data, { lang: language.value });
    }

    /**
     * Logout a user
     */
    async logout() {
        return super.post(`${url}/logout`, {}, { lang: language.value });
    }

    /**
     * Forgot password
     */
    async forgotPassword(data: { email: string }) {
        return super.post(`${url}/forgot-password`, data, { lang: language.value });
    }

    /**
     * Update password
     */
    async updatePassword(token: string, data: { password: string, password_confirm: string }) {
        return super.patch(`${url}/update-password/${token}`, data, { lang: language.value });
    }

    /**
     * Search users
     */
    async search(query: string) {
        return super.get(`${url}/search`, { q: query, lang: language.value });
    }
}