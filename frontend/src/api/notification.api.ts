import BaseApi from "./base.api";

const url = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

export default class NotificationApi extends BaseApi {
    /**
     * Get all notifications for a user
     */
    index() {
        return super.get(`${url}`);
    }

    /**
     * Create a new notification
     */
    create(data: { type: string, message: string, data: any }) {
        return super.post(`${url}`, data);
    }
}