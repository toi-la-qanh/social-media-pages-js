<template>
    <div :class="[
        'max-h-[500px] lg:min-h-[550px] lg:w-3/7 sm:w-9/11 md:mb-0 m-4 w-full rounded-3xl border py-3 overflow-y-auto',
        theme === 'dark' ? 'bg-stone-900/80 border-gray-800' : 'bg-white border-gray-300'
    ]" style="scrollbar-width: none;">
        <!-- Show error message -->
        <div v-if="error"
            class="text-center mt-5 min-h-110 sm:min-h-120 gap-2 flex flex-col items-center justify-center">
            <p class="text-red-500 items-start">{{ error }}</p>
            <button class="border border-gray-300 py-1 px-2 rounded-lg items-center" :class="theme === 'dark'
                ? 'hover:bg-gray-400'
                : 'hover:text-gray-500'" @click="goBack">
                {{ $t('specifiedPost.buttons.goBack') }}
            </button>
        </div>

        <div v-else>
            <div v-if="!post">
                {{ $t('specifiedPost.noPostsAvailable') }}
            </div>
            <div v-else>
                <p :class="[
                    'flex text-base justify-center text-center items-center absolute top-10 left-0 w-full',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                ]">{{ post.views }} {{ $t('specifiedPost.views') }}</p>
                <!-- Main content -->
                <div class="px-6 py-3 ">
                    <div class="flex flex-col w-full border-b border-stone-300">
                        <div class="flex flex-row justify-between">
                            <div class="flex flex-row gap-3">
                                <!-- User Avatar -->
                                <img :src="post.author_image_url || '/default-avatar.png'" @error="handleImageError"
                                    alt=""
                                    class="w-8 h-8 rounded-full border border-stone-300 object-cover aspect-square" />
                                <!-- User Name -->
                                <router-link :to="`/profile/${post.author_id}`">
                                    <p class="font-bold">{{ post.author_name }}</p>
                                </router-link>
                                <p class="text-stone-400">{{ post.created_at }}</p>
                            </div>

                            <!-- Setttings -->
                            <button class="flex items-start">
                                <font-awesome-icon class="text-gray-400" :icon="faEllipsis" />
                            </button>
                        </div>

                        <!-- Post Content -->
                        <router-link class="my-1 block w-full relative" :to="`/post/${post.id}`">
                            <p>{{ post.content }}</p>
                        </router-link>

                        <!-- Interactions -->
                        <div :class="[
                            'flex flex-row gap-5 py-2 text-base',
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                        ]">
                            <!-- Like -->
                            <div class="flex gap-1 items-center">
                                <button @click="handleLike(post.id, post)">
                                    <FontAwesomeIcon :class="[
                                        post.hasLiked ? 'text-red-600 hover:text-red-300' : '',
                                        'hover:text-gray-500'
                                    ]" :icon="faHeart" />
                                </button>
                                <p>{{ post.likes || 0 }}</p>
                            </div>

                            <!-- Reply -->
                            <div class="flex gap-1 items-center">
                                <button>
                                    <FontAwesomeIcon class="hover:text-gray-500" :icon="faComment" />
                                </button>
                                <p>{{ post.replies_count || 0 }}</p>
                            </div>

                            <!-- Retweet -->
                            <div class="flex gap-1 items-center">
                                <button>
                                    <FontAwesomeIcon class="hover:text-gray-500" :icon="faRetweet" />
                                </button>
                                <p>{{ post.retweets_count || 0 }}</p>
                            </div>

                            <!-- Share -->
                            <button>
                                <FontAwesomeIcon class="hover:text-gray-500" :icon="faShareFromSquare" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-row justify-between px-6 py-2 border-b border-stone-300">
            <p class="font-bold">Top</p>
            <p>{{ $t('specifiedPost.buttons.viewActivity') }}</p>
        </div>

        <!-- Comment Form -->
        <div v-if="user && user.id !== null" class="relative border-b border-gray-400 m-5">
            <form action="" method="POST" class="flex justify-between" @submit.prevent="handleComment">
                <input ref="inputRef" v-model="inputComment" name="content" type="text"
                    :placeholder="$t('specifiedPost.input.reply')" class="border p-2 w-full border-none outline-none"
                    :class="[
                        isFixed ? 'fixed top-0 left-0 z-10' : 'relative']" />
                <button class="border border-gray-300 py-1 px-2 rounded-lg">
                    {{ $t('specifiedPost.buttons.post') }}
                </button>
            </form>
        </div>

        <!-- Comment List -->
        <div>
            <!-- Show if there are no replies -->
            <p v-if="replies.message" class="text-center">
                {{ replies.message }}
            </p>
            <div v-else>
                <div v-for="reply in replies" :key="reply.id">
                    <div class="flex flex-row gap-2 px-6 py-3">
                        <img :src="reply.author_image_url || '/default-avatar.png'" @error="handleImageError" alt=""
                            class="w-8 h-8 rounded-full border border-gray-500 object-cover aspect-square" />

                        <!-- User Name andReply Content -->
                        <div class="flex flex-row justify-between top-[-2px] relative w-full">
                            <div class="flex flex-col w-full">
                                <div class="flex flex-row gap-3">
                                    <!-- Owner Reply Name -->
                                    <router-link :to="`/profile/${reply.author_id}`">
                                        <p class="font-bold">{{ reply.author_name }}</p>
                                    </router-link>
                                    <p class="text-stone-400">{{ reply.created_at }}</p>
                                </div>

                                <!-- Post Content -->
                                <p class="my-1 block w-full relative">{{ reply.content }}</p>

                                <!-- View Count -->
                                <div class="flex justify-end text-base text-gray-400">
                                    {{ reply.views }} {{ $t('specifiedPost.views') }}
                                </div>

                                <!-- Interactions -->
                                <div class="flex flex-row gap-10 text-base text-stone-700">
                                    <!-- Like -->
                                    <div class="flex gap-1 items-center">
                                        <button @click="handleLike">
                                            <FontAwesomeIcon :class="[
                                                likeStatus ? 'text-red-600 hover:text-red-300' : '',
                                                'hover:text-gray-500'
                                            ]" :icon="faHeart" />
                                        </button>
                                        <p class="text-base">{{ reply.likes_count || 0 }}</p>
                                    </div>

                                    <!-- Comment -->
                                    <div class="flex gap-1 items-center">
                                        <button>
                                            <FontAwesomeIcon class="hover:text-gray-500" :icon="faComment" />
                                        </button>
                                        <p class="text-base">{{ reply.replies_count || 0 }}</p>
                                    </div>

                                    <!-- Retweet -->
                                    <div class="flex gap-1 items-center">
                                        <button>
                                            <FontAwesomeIcon class="hover:text-gray-500" :icon="faRetweet" />
                                        </button>
                                        <p class="text-base">{{ reply.retweets_count || 0 }}</p>
                                    </div>

                                    <!-- Share -->
                                    <button>
                                        <FontAwesomeIcon class="hover:text-gray-500" :icon="faShareFromSquare" />
                                    </button>
                                </div>
                            </div>

                            <!-- Setttings -->
                            <button class="flex items-start">
                                <font-awesome-icon class="text-gray-400" :icon="faEllipsis" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faComment,
    faHeart,
    faShareFromSquare,
} from '@fortawesome/free-regular-svg-icons';
import { faRetweet, faArrowLeft, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import PostApi from '../api/post.api';
import LikeApi from '../api/like.api';
import RetweetApi from '../api/retweet.api';
import { theme, isLoading, user } from '../store.ts';

export default {
    name: 'SpecifiedPost',
    components: {
        FontAwesomeIcon,
    },
    setup() {
        return { faComment, faHeart, faShareFromSquare, faRetweet, faArrowLeft, faEllipsis }
    },
    data() {
        return {
            post: null,
            replies: [],
            likes: 0,
            countOfReplies: 0,
            isLoading,
            user,
            error: null,
            likeStatus: false,
            inputComment: '',
            theme
        }
    },
    async mounted() {
        await this.fetchPost();
        await this.fetchReplies();
        this.applyLikedFromSession();
        this.eventListener();
    },
    methods: {
        /**
         * Handle image loading errors
         */
        handleImageError(event) {
            const target = event.target;
            if (target && target.src !== '/default-avatar.png') {
                target.src = '/default-avatar.png';
            }
        },

        /**
         * Fetch post data
         */
        async fetchPost() {
            // Check if post data is already in session storage
            const cachedPost = sessionStorage.getItem(`post-${this.$route.params.id}`);
            if (cachedPost) {
                this.post = JSON.parse(cachedPost);
                // Fetch likes for this post
                await this.fetchLikes(this.post.id);

                // Fetch count of replies for this post
                await this.fetchCountOfReplies(this.post.id);

                // Fetch count of retweets for this post
                await this.fetchRetweets(this.post.id);
                return;
            }
            this.isLoading = true;
            const postAPI = new PostApi();
            try {
                const response = await postAPI.show(this.$route.params.id);
                if (response.errors) {
                    this.error = response.errors;
                    this.post = null;
                    return;
                }
                this.post = response;
                sessionStorage.setItem(`post-${this.post.id}`, JSON.stringify(response)); // Store in session

                // Fetch likes for this post
                await this.fetchLikes();

                // Fetch count of replies for this post
                await this.fetchCountOfReplies();
            } catch (error) {
                console.error('Error fetching post', error);
                this.error = error;
                this.post = null;
                return;
            } finally {
                this.isLoading = false;
            }

        },

        /**
         * Fetch likes of this post
         */
        async fetchLikes(postID) {
            const key = `post-${postID}-likes`;
            const stored = sessionStorage.getItem(key);
            if (stored && stored !== 'undefined') {
                this.post.likes = JSON.parse(stored);
            }

            const likeAPI = new LikeApi();
            const response = await likeAPI.getLikesOfPost(postID);
            if (response) {
                this.post.likes = response.count;
            }
        },

        /**
         * Fetch count of replies of this post
         */
        async fetchCountOfReplies(postID) {
            const key = `post-${postID}-replies-count`;
            const stored = sessionStorage.getItem(key);
            if (stored && stored !== 'undefined') {
                this.post.replies_count = JSON.parse(stored);
            }

            const postAPI = new PostApi();
            const response = await postAPI.getCountOfReplies(postID);
            if (response) {
                this.post.replies_count = response.count;
            }
        },

        /**
        * Fetch count of retweets for this post
        */
        async fetchRetweets(postID) {
            // check if the retweets for this post are already in session storage
            const key = `post-${postID}-retweets`;
            const stored = sessionStorage.getItem(key);
            if (stored && stored !== 'undefined') {
                this.post.retweets_count = JSON.parse(stored);
            }

            // if not, fetch from the API
            const retweetAPI = new RetweetApi();
            const response = await retweetAPI.getCountOfRetweets(postID);
            sessionStorage.setItem(key, JSON.stringify(response.count));
            this.post.retweets_count = response.count;
        },

        /**
         * Fetch replies of this post
         */
        async fetchReplies() {
            // Check if replies are already in session storage
            const cachedReplies = sessionStorage.getItem(`reply-post-${this.$route.params.id}`);
            if (cachedReplies) {
                this.replies = JSON.parse(cachedReplies);
                return;
            }
            this.isLoading = true;
            const postAPI = new PostApi();
            try {
                const response = await postAPI.showReplies(this.$route.params.id);
                console.log(response);
                if (response.errors) {
                    this.error = response.errors;
                    this.replies = [];
                    return;
                }
                if (response.message) {
                    this.replies.message = response.message;
                    return;
                }
                this.replies = response;
                sessionStorage.setItem(`reply-post-${this.post.id}`, JSON.stringify(response)); // Store in session
                // fetch like count for each reply in parallel
                const likeAPI = new LikeApi();
                await Promise.all(
                    this.replies.map(async (reply) => {
                        const res = await likeAPI.getLikesOfPost(reply.id);
                        // backend returns { count: number }
                        reply.likes_count = res.count ?? 0;
                    }),
                );
                return;
            } catch (err) {
                this.error = err;
                sessionStorage.removeItem(`reply-post-${this.$route.params.id}`);
                this.replies = [];
                return;
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Check if user has liked this post
         */
        applyLikedFromSession() {
            const key = `liked-post-${this.$route.params.id}`;
            const stored = sessionStorage.getItem(key);
            this.likeStatus = !!stored;
        },

        /**
         * Handle like/unlike for this specific post
         */
        async handleLike() {
            const likeAPI = new LikeApi();
            const postID = this.$route.params.id;
            const key = `liked-post-${postID}`;
            try {
                if (this.likeStatus) {
                    await likeAPI.destroy(postID);
                    this.likeStatus = false;
                    this.likes = Math.max(0, (this.likes || 0) - 1);
                    sessionStorage.removeItem(key);
                } else {
                    await likeAPI.store(postID);
                    this.likeStatus = true;
                    this.likes = (this.likes || 0) + 1;
                    sessionStorage.setItem(key, 'true');
                }
            } catch (err) {
                console.error('Error toggling like', err);
            }
        },

        /**
         * Create a new reply
         */
        async handleComment() {
            const postAPI = new PostApi();
            try {
                const response = await postAPI.createReply(this.$route.params.id, this.inputComment);
                if (response) {
                    this.inputComment = '';
                    window.location.reload();
                }
            } catch (err) {
                console.error('Error creating reply', err);
            }
        },

            goBack() {
            this.$router.back();
        },
        /**
         * Listen for like/unlike events from other users and update this post
         */
        eventListener() {
            this.$socket.on('like', (postID) => {
                if (postID === this.$route.params.id) {
                    this.likes = (this.likes || 0) + 1;
                }
            });
            this.$socket.on('unlike', (postID) => {
                if (postID === this.$route.params.id) {
                    this.likes = Math.max(0, (this.likes || 0) - 1);
                }
            });
        },
    }
}
</script>