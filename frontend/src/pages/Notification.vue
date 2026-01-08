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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faComment,
    faHeart,
    faShareFromSquare,
} from '@fortawesome/free-regular-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { isLoading } from '../store.ts';
import NotificationApi from '../api/notification.api';

export default {
    name: 'Notification',
    components: {
        FontAwesomeIcon,
    },
    setup() {
        return { faComment, faHeart, faShareFromSquare, faRetweet }
    },
    data() {
        return {
            notifications: [] as any[],
            isLoading,
            error: null as string | null,
        }
    },
    async mounted() {
        // start listening for realtime like/unlike events
        this.eventListener();
    },
    methods: {


        /**
         * Listen for like/unlike events from other users and update only the affected post
         */
        eventListener() {
            this.$socket.on('like', (postID: string) => {
                const post = this.posts.find((p: any) => p.id === postID);
                if (post) {
                    post.likes = (post.likes || 0) + 1;
                }
            });
            this.$socket.on('unlike', (postID: string) => {
                const post = this.posts.find((p: any) => p.id === postID);
                if (post) {
                    post.likes = Math.max(0, (post.likes || 0) - 1);
                }
            });
        }
    }
}
</script>
