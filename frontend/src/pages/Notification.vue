<template>
    <div
        class="h-auto shadow-gray-200 shadow-sm lg:w-1/2 md:w-2/3 md:mb-0 m-4 w-full rounded-3xl border-gray-300 border px-6 py-3">
        <div v-if="error" class="flex justify-center items-center h-screen w-full">
            <div class="text-red-500">{{ error }}</div>
        </div>
        <div v-else>
            <div v-if="!notifications || notifications.length === 0">
                You have no notifications
            </div>
            <div v-else>
                <div v-for="notification in notifications" :key="notification.id" :class="[
                    'border-b border-gray-400 last:border-none'
                ]">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { isLoading } from '../store.ts';
import NotificationApi from '../api/notification.api';

export default {
    name: 'Notification',
    data() {
        return {
            notifications: [] as any[],
            isLoading,
            error: null as string | null,
        }
    },
    async mounted() {
        await this.fetchNotifications();
    },
    methods: {
        /**
         * Fetch notifications from the API
         */
        async fetchNotifications() {
            const api = new NotificationApi();
            try {
                const response = await api.index();
                if (response?.errors) {
                    this.error = response.errors;
                    this.notifications = [];
                    return;
                }
                this.notifications = Array.isArray(response) ? response : [];
            } catch (err: any) {
                this.error = err?.message ?? String(err);
                this.notifications = [];
            }
        },
    }
}
</script>
