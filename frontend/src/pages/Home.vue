<template>
    <div ref="scrollContainer" :class="[
        'h-screen last:pb-20 lg:w-3/7 sm:w-9/11 md:mb-0 m-4 w-full rounded-3xl border py-3 overflow-y-auto',
        theme === 'dark' ? 'bg-stone-900/80 border-gray-800' : 'bg-white border-gray-300'
    ]" style="scrollbar-width: none;" @scroll="handleScroll">
        <!-- Show Errors -->
        <div v-if="error" class="flex justify-center items-center h-screen w-full">
            <div class="text-red-500">{{ error }}</div>
        </div>
        <div v-else>
            <div v-if="!posts || posts.length === 0">
                {{ $t('home.noPosts') }}
            </div>
            <div v-else>
                <!-- Create Post Input -->
                <div v-if="user && user.id !== null" :class="[
                    'w-full border-b hidden sm:block',
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                ]">
                    <div class="flex flex-row justify-between px-6 py-3">
                        <!-- User Avatar and Input -->
                        <div class="flex flex-row items-center gap-3">
                            <router-link :to="`/profile/${user.username}`">
                                <img :src="user.image_url || '/default-avatar.png'" alt=""
                                    class="w-8 h-8 rounded-full border border-gray-500 object-cover aspect-square" />
                            </router-link>
                            <input class="outline-none" type="text" :placeholder="$t('home.createPost.placeholder')"
                                @click="handleCreatePost">
                        </div>

                        <!-- Create Post Button -->
                        <button :class="[
                            'border rounded-xl px-4 py-2 font-bold',
                            theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                        ]" @click="handleCreatePost">
                            {{ $t('home.createPost.button') }}
                        </button>
                    </div>
                </div>

                <!-- Posts -->
                <div v-for="post in posts" :key="post.id" :class="[
                    'border-b',
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
                    'last:border-none'
                ]">
                    <div class="px-6 py-3 ">
                        <div class="flex flex-row gap-3">
                            <!-- User Avatar -->
                            <img :src="post.author_image_url || '/default-avatar.png'" alt=""
                                class="w-8 h-8 rounded-full border border-stone-300 object-cover aspect-square" />

                            <!-- User Data and Post Content -->
                            <div class="flex flex-row justify-between top-[-2px] relative w-full">
                                <div class="flex flex-col w-full gap-1">
                                    <!-- User Data -->
                                    <div class="flex flex-row gap-2">
                                        <!-- User Name -->
                                        <router-link :to="`/profile/${post.author_name}`">
                                            <p class="font-bold">{{ post.author_name }}</p>
                                        </router-link>
                                        <div class="flex flex-row items-center gap-2" v-if="post.reply_to_user_id">
                                            <font-awesome-icon class="text-stone-400" :icon="faAngleRight  " />
                                            <router-link :to="`/profile/${post.reply_to_user_name}`">
                                                <p class="font-bold">{{ post.reply_to_user_name }}</p>
                                            </router-link>
                                        </div>
                                        <p class="text-stone-400">{{ post.created_at }}</p>
                                    </div>

                                    <!-- Post Content -->
                                    <router-link class="block w-full whitespace-pre-wrap break-all" :to="`/post/${post.id}`">
                                        {{ post.content }}
                                    </router-link>

                                    <img :src="post.image_url" alt=""
                                        class="my-2 w-full max-h-[400px] object-cover rounded-lg">

                                    <!-- Interactions -->
                                    <div :class="[
                                        'flex flex-row gap-5 text-base',
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
                                            <button @click="openReply(post)">
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

                                <!-- Setttings -->
                                <button class="flex items-start">
                                    <font-awesome-icon class="text-gray-400" :icon="faEllipsis" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Create Reply Modal (single instance) -->
                <CreateReplyModal v-if="showCreateReplyModal && selectedReplyPost" :post="selectedReplyPost" />

                <!-- Loading More Indicator -->
                <div v-if="isLoadingMore" class="flex justify-center items-center py-4">
                    <p class="text-stone-400">...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faComment,
    faHeart,
    faShareFromSquare,
} from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faEllipsis, faRetweet } from '@fortawesome/free-solid-svg-icons';
import PostApi from '../api/post.api';
import LikeApi from '../api/like.api';
import RetweetApi from '../api/retweet.api';
import { isLoading, user, showCreatePostModal, theme, showCreateReplyModal } from '../store.ts';
import { defineAsyncComponent } from 'vue';

export default {
    name: 'Post',
    components: {
        FontAwesomeIcon,
        CreateReplyModal: defineAsyncComponent(() => import('../components/CreateReplyModal.vue')),
    },
    setup() {
        return { faComment, faHeart, faShareFromSquare, faRetweet, faEllipsis, faAngleRight }
    },
    data() {
        return {
            posts: [],
            isLoading,
            error: null,
            user,
            showCreatePostModal,
            showCreateReplyModal,
            selectedReplyPost: null,
            theme,
            currentPage: 1,
            isLoadingMore: false,
            hasMorePages: true,
        }
    },
    async mounted() {
        await this.fetchPosts();
        // start listening for realtime like/unlike events
        this.eventListener();
        // Listen for post creation events
        window.addEventListener('post-created', this.refreshPosts);
    },
    beforeUnmount() {
        // Remove scroll listener if needed
        if (this.$refs.scrollContainer) {
            this.$refs.scrollContainer.removeEventListener('scroll', this.handleScroll);
        }

        this.$socket.off('like');
        this.$socket.off('unlike');
        // Remove post creation event listener
        window.removeEventListener('post-created', this.refreshPosts);
    },
    methods: {
        /**
         * Fetch posts from the API
         */
        async fetchPosts(reset = false) {
            if (reset) {
                this.currentPage = 1;
                this.posts = [];
                this.hasMorePages = true;
                sessionStorage.removeItem("posts");
            }

            // Load cached posts if not on first page
            const cachedPosts = sessionStorage.getItem("posts");
            if (cachedPosts && this.currentPage === 1) {
                this.posts = JSON.parse(cachedPosts);

                // hydrate likes for cached posts
                await Promise.all(
                    this.posts.map(async (post) => {
                        post.likes = await this.fetchLikes(post.id);
                        post.retweets_count = await this.fetchRetweets(post.id);
                        post.replies_count = await this.fetchReplies(post.id);
                    })
                );

                // check if the user has liked any post
                this.posts = await this.applyLikedFromSession(this.posts);
                this.currentPage = 1;
                return;
            }

            // Set loading state
            if (this.currentPage === 1) {
                this.isLoading = true;
            } else {
                this.isLoadingMore = true;
            }

            // Fetch posts from the API
            const postAPI = new PostApi();
            try {
                const response = await postAPI.index(this.currentPage, 10);

                if (!response || response.length === 0) {
                    this.hasMorePages = false;
                    if (this.currentPage === 1) {
                        this.posts = [];
                    }
                    return;
                }

                if (this.currentPage === 1) {
                    this.posts = response;
                    sessionStorage.setItem("posts", JSON.stringify(response)); // Store in session
                } else {
                    // Append new posts to existing ones
                    this.posts = [...this.posts, ...response];
                }

                // Check if we got fewer posts than requested (last page)
                if (response.length < 10) {
                    this.hasMorePages = false;
                }

                // fetch likes for each post
                const newPosts = this.currentPage === 1 ? this.posts : response;
                await Promise.all(
                    newPosts.map(async (post) => {
                        post.likes = await this.fetchLikes(post.id);
                        post.retweets_count = await this.fetchRetweets(post.id);
                        post.replies_count = await this.fetchReplies(post.id);
                    })
                );

                // apply initial like state from session
                if (this.currentPage === 1) {
                    this.posts = await this.applyLikedFromSession(this.posts);
                } else {
                    // Apply liked state only to new posts
                    const newPostsWithLiked = await this.applyLikedFromSession(newPosts);
                    // Replace the new posts in the array with the liked versions
                    const startIndex = this.posts.length - newPosts.length;
                    newPostsWithLiked.forEach((likedPost, index) => {
                        this.posts[startIndex + index] = likedPost;
                    });
                }
            } catch (err) {
                console.error('Error fetching posts', err);
                if (this.currentPage === 1) {
                    this.error = err;
                    sessionStorage.removeItem("posts");
                    this.posts = [];
                }
                return;
            } finally {
                this.isLoading = false;
                this.isLoadingMore = false;
            }
        },

        /**
         * Open reply modal for a specific post
         */
        openReply(post) {
            this.selectedReplyPost = post;
            this.showCreateReplyModal = true;
        },

        /**
         * Handle scroll event to load more posts
         */
        handleScroll(event) {
            const container = event.target;
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            // Check if user scrolled near the bottom (within 100px)
            if (scrollHeight - scrollTop - clientHeight < 100) {
                this.loadMorePosts();
            }
        },

        /**
         * Load more posts (next page)
         */
        async loadMorePosts() {
            // Prevent multiple simultaneous requests
            if (this.isLoadingMore || !this.hasMorePages) {
                return;
            }

            this.currentPage += 1;
            await this.fetchPosts();
        },

        /**
         * Fetch likes for each post
         */
        async fetchLikes(postID) {
            // check if the likes for this post are already in session storage
            const key = `post-${postID}-likes`;
            const stored = sessionStorage.getItem(key);
            if (stored && stored !== 'undefined') {
                return JSON.parse(stored);
            }

            // if not, fetch from the API
            const likeAPI = new LikeApi();
            const response = await likeAPI.getLikesOfPost(postID);
            sessionStorage.setItem(key, JSON.stringify(response.count));
            return response.count;
        },

        /**
         * Fetch count of replies for each post
         */
        async fetchReplies(postID) {
            // check if the likes for this post are already in session storage
            const key = `post-${postID}-replies-count`;
            const stored = sessionStorage.getItem(key);
            if (stored && stored !== 'undefined') {
                return JSON.parse(stored);
            }

            // if not, fetch from the API
            const postAPI = new PostApi();
            const response = await postAPI.getCountOfReplies(postID);
            sessionStorage.setItem(key, JSON.stringify(response.count));
            return response.count;
        },

        /**
         * Fetch count of retweets for each post
        */
        async fetchRetweets(postID) {
            // check if the retweets for this post are already in session storage
            const key = `post-${postID}-retweets`;
            const stored = sessionStorage.getItem(key);
            if (stored && stored !== 'undefined') {
                return JSON.parse(stored);
            }

            // if not, fetch from the API
            const retweetAPI = new RetweetApi();
            const response = await retweetAPI.getCountOfRetweets(postID);
            sessionStorage.setItem(key, JSON.stringify(response.count));
            return response.count;
        },

        /**
         * Apply liked state from session storage
         */
        async applyLikedFromSession(posts) {
            return await Promise.all(posts.map(async (post) => {
                const key = `liked-post-${post.id}`;

                const stored = sessionStorage.getItem(key);
                // If we have a stored value, use it
                if (stored && stored !== 'null' && stored !== 'undefined') {
                    const liked = JSON.parse(stored);
                    return {
                        ...post,
                        hasLiked: liked === true || liked === 'true',
                    };
                }

                // If no stored value, check with API
                const likeAPI = new LikeApi();
                const response = await likeAPI.checkIfLiked(post.id);
                if (response.errors) {
                    return {
                        ...post,
                        hasLiked: false,
                    };
                }
                sessionStorage.setItem(key, JSON.stringify(response.liked));
                return {
                    ...post,
                    hasLiked: response.liked,
                };
            }));
        },

        /**
         * Handle like/unlike event
         */
        async handleLike(postID, post) {
            const likeAPI = new LikeApi();
            const key = `liked-post-${postID}`;
            try {
                if (post.hasLiked) {
                    const response = await likeAPI.destroy(postID);
                    if (response.errors) {
                        console.error('Error unliking post', response.errors);
                        return;
                    }
                    post.hasLiked = false;

                    // Notify other users that this user unliked the post
                    this.$socket.emit('unlike', postID);
                    // instantly update the like count
                    post.likes = Math.max(0, (post.likes || 0) - 1);
                    sessionStorage.setItem(key, 'false');
                } else {
                    const response = await likeAPI.store(postID);
                    if (response.errors) {
                        return;
                    }
                    post.hasLiked = true;

                    // Notify other users that this user liked the post
                    this.$socket.emit('like', postID);
                    // instantly update the like count
                    post.likes = (post.likes || 0) + 1;
                    sessionStorage.setItem(key, 'true');
                }
            } catch (err) {
                console.error('Error toggling like', err);
            }
        },

        /**
         * Handle create post event
         */
        handleCreatePost() {
            this.showCreatePostModal = true;
        },

        /**
         * Refresh posts list (called after creating a new post)
         */
        async refreshPosts() {
            await this.fetchPosts(true);
        },

        /**
         * Listen for like/unlike events from other users and update only the affected post
         */
        eventListener() {
            this.$socket.on('like', (postID) => {
                const post = this.posts.find((p) => p.id === postID);
                if (post) {
                    post.likes = (post.likes || 0) + 1;
                }
            });
            this.$socket.on('unlike', (postID) => {
                const post = this.posts.find((p) => p.id === postID);
                if (post) {
                    post.likes = Math.max(0, (post.likes || 0) - 1);
                }
            });
        }
    }
}
</script>
