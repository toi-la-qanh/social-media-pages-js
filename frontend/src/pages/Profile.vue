<template>
    <div :class="[
        'max-h-[500px] lg:min-h-[550px] lg:w-3/7 sm:w-9/11 md:mb-0 m-4 w-full rounded-3xl border py-3 overflow-y-auto',
        theme === 'dark' ? 'bg-stone-900/80 border-gray-800' : 'bg-white border-gray-300'
    ]" style="scrollbar-width: none;">
        <!-- Show Errors -->
        <div v-if="error" class="flex justify-center items-center h-screen w-full">
            <div class="text-red-500">{{ error }}</div>
        </div>
        <div v-else>
            <!-- Show Not Found Message -->
            <div v-if="!thisUser">
                <div class="flex justify-center items-center h-screen w-full">
                    <div class="text-red-500">User not found</div>
                </div>
            </div>
            <div v-else>
                <!-- User Profile -->
                <div class="py-4 px-6 space-y-5">
                    <!-- User Data -->
                    <div class="flex flex-row justify-between items-center ">
                        <div class="flex flex-col gap-1">
                            <p class="text-2xl font-bold">{{ thisUser.full_name }}</p>
                            <p class="text-stone-400">{{ thisUser.username }}</p>
                            <p class="text-stone-400">{{ thisUser.bio }}</p>
                        </div>
                        <img :src="thisUser.image_url || '/default-avatar.png'" alt="User Image"
                            class="w-20 h-20 rounded-full border border-gray-500 object-cover aspect-square" />
                    </div>

                    <!-- Followers Count -->
                    <p class="text-stone-400">{{ followers.length }} followers</p>

                    <!-- Edit Profile Button -->
                    <button v-if="user && user.id === thisUser.id" @click="handleEditProfile" :class="['w-full border rounded-xl px-6 py-1.5 font-bold',
                        theme === 'dark' ? 'border-gray-700' : 'border-stone-300'
                    ]">Edit Profile</button>

                    <!-- Follow Button -->
                    <button v-if="user && user.id !== thisUser.id && !isFollowing" @click="handleFollow" :class="['w-full border rounded-xl px-6 py-1.5 font-bold',
                        theme === 'dark' ? 'border-gray-700' : 'border-stone-300'
                    ]">Follow</button>

                    <!-- Follow Button -->
                    <button v-if="user && user.id !== thisUser.id && isFollowing" @click="handleUnfollow" :class="['w-full border rounded-xl px-6 py-1.5 font-bold',
                        theme === 'dark' ? 'border-gray-700' : 'border-stone-300'
                    ]">Following</button>
                </div>

                <!-- Tabs -->
                <div :class="['flex flex-row w-full border-b h-12',
                    theme === 'dark' ? 'border-gray-700' : 'border-stone-300'
                ]">
                    <button :class="['w-full h-full border-b',
                        postTab
                            ? (theme === 'dark' ? 'border-stone-500 font-bold' : 'border-black font-bold')
                            : (theme === 'dark' ? 'border-transparent' : 'border-transparent')
                    ]" @click="handleTab('posts')">Posts</button>
                    <button :class="['w-full h-full border-b',
                        repliesTab
                            ? (theme === 'dark' ? 'border-stone-500 font-bold' : 'border-black font-bold')
                            : (theme === 'dark' ? 'border-transparent' : 'border-transparent')
                    ]" @click="handleTab('replies')">Replies</button>
                    <button :class="['w-full h-full border-b',
                        repostsTab
                            ? (theme === 'dark' ? 'border-stone-500 font-bold' : 'border-black font-bold')
                            : (theme === 'dark' ? 'border-transparent' : 'border-transparent')
                    ]" @click="handleTab('reposts')">Reposts</button>
                </div>

                <!-- Posts -->
                <div v-if="postTab">
                    <!-- Create Post Component -->
                    <div v-if="user && user.id === thisUser.id" :class="[
                        'w-full border-b',
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    ]" @click="handleCreatePost">
                        <div class="flex flex-row justify-between px-6 py-4">
                            <div class="flex flex-row items-center gap-3">
                                <img :src="thisUser.image_url || '/default-avatar.png'" alt=""
                                    class="w-8 h-8 rounded-full border border-gray-500 object-cover aspect-square" />
                                <input class="outline-none" type="text"
                                    :placeholder="$t('profile.createPost.placeholder')">
                            </div>
                            <button :class="[
                                'border rounded-xl px-4 py-2 font-bold',
                                theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                            ]" @click="handleCreatePost">
                                {{ $t('profile.createPost.button') }}
                            </button>
                        </div>
                    </div>

                    <!-- No Posts Found -->
                    <div v-if="posts.length === 0" class="flex w-full h-40 items-center justify-center text-center">
                        <p class="text-stone-400">No posts yet.</p>
                    </div>

                    <!-- Posts Found -->
                    <div v-else>
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
                                                <div class="flex flex-row items-center gap-2"
                                                    v-if="post.reply_to_user_id">
                                                    <font-awesome-icon class="text-stone-400" :icon="faAngleRight" />
                                                    <router-link :to="`/profile/${post.reply_to_user_name}`">
                                                        <p class="font-bold">{{ post.reply_to_user_name }}</p>
                                                    </router-link>
                                                </div>
                                                <p class="text-stone-400">{{ post.created_at }}</p>
                                            </div>

                                            <!-- Post Content -->
                                            <router-link class="block w-full relative" :to="`/post/${post.id}`">
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
                                                        <FontAwesomeIcon class="hover:text-gray-500"
                                                            :icon="faComment" />
                                                    </button>
                                                    <p>{{ post.replies_count || 0 }}</p>
                                                </div>

                                                <!-- Retweet -->
                                                <div class="flex gap-1 items-center">
                                                    <button>
                                                        <FontAwesomeIcon class="hover:text-gray-500"
                                                            :icon="faRetweet" />
                                                    </button>
                                                    <p>{{ post.retweets_count || 0 }}</p>
                                                </div>

                                                <!-- Share -->
                                                <button>
                                                    <FontAwesomeIcon class="hover:text-gray-500"
                                                        :icon="faShareFromSquare" />
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

                <!-- Replies -->
                <div v-if="repliesTab">
                    <!-- No Replies Found -->
                    <div v-if="replies.length === 0" class="flex w-full h-40 items-center justify-center text-center">
                        <p class="text-stone-400">No replies yet.</p>
                    </div>

                    <!-- Replies Found -->
                    <div v-else>
                        <!-- <div v-for="post in posts" :key="post.id">
                            <p>{{ post.content }}</p>
                        </div> -->
                    </div>
                </div>

                <!-- Reposts -->
                <div v-if="repostsTab">
                    <!-- No Reposts Found -->
                    <div v-if="reposts.length === 0" class="flex w-full h-40 items-center justify-center text-center">
                        <p class="text-stone-400">No reposts yet.</p>
                    </div>
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
import { faRetweet, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { theme, isLoading, user, showCreatePostModal } from '../store.ts';
import UserApi from '../api/user.api';
import FollowApi from '../api/follow.api';
import PostApi from '../api/post.api';

export default {
    name: 'Profile',
    components: {
        FontAwesomeIcon,
    },
    setup() {
        return { faComment, faHeart, faShareFromSquare, faRetweet, faEllipsis }
    },
    data() {
        return {
            thisUser: null as any,
            user,
            followers: [] as any[],
            following: [] as any[],
            theme,
            isLoading,
            error: null as any,
            posts: [] as any[],
            replies: [] as any[],
            reposts: [] as any[],
            postTab: true,
            repliesTab: false,
            repostsTab: false,
            showCreatePostModal,
            isFollowing: false,
        }
    },
    async mounted() {
        await this.fetchUser();
        await this.fetchFollowers();
        await this.fetchFollowing();
        await this.fetchPosts();
        await this.handleFollow();
    },
    watch: {
    '$route.params.username': async function() {
      // When the username changes in the route, re-fetch the user data
      await this.fetchUser();
      await this.fetchFollowers();
      await this.fetchFollowing();
      await this.fetchPosts();
      await this.handleFollow();
    }
  },
    methods: {
        /**
         * Fetch user data from the API
         */
        async fetchUser() {
            const cachedUser = sessionStorage.getItem(`user-${this.$route.params.username}`);
            if (cachedUser) {
                this.thisUser = JSON.parse(cachedUser);
                console.log(this.thisUser);
                return;
            }
            const userAPI = new UserApi();
            try {
                const response = await userAPI.getThisUser(this.$route.params.username as string);
                if (response.errors) {
                    this.error = response.errors;
                    this.thisUser = null;
                    return;
                }
                this.thisUser = response;
                sessionStorage.setItem(`user-${this.thisUser.username}`, JSON.stringify(response));
            } catch (error) {
                console.error('Error fetching user', error);
                this.error = error;
                this.thisUser = null;
            }
        },

        /**
         * Fetch followers data of this user
         */
        async fetchFollowers() {
            const key = `followers-${this.thisUser.username}`;
            if (sessionStorage.getItem(key)) {
                this.followers = JSON.parse(sessionStorage.getItem(key) as string);
                return;
            }
            const followAPI = new FollowApi();
            try {
                const response = await followAPI.getFollowers(this.thisUser.id);
                if (response) {
                    this.followers = response;
                    sessionStorage.setItem(key, JSON.stringify(response));
                }
            } catch (error) {
                console.error('Error fetching followers', error);
            }
        },

        /**
         * Fetch following data of this user
         */
        async fetchFollowing() {
            const key = `following-${this.thisUser.username}`;
            if (sessionStorage.getItem(key)) {
                this.following = JSON.parse(sessionStorage.getItem(key) as string);
                return;
            }
            const followAPI = new FollowApi();
            try {
                const response = await followAPI.getFollowing(this.thisUser.id);
                if (response.errors) {
                    console.error('Error fetching following', response.errors);
                    return;
                }
                this.following = response;
                sessionStorage.setItem(key, JSON.stringify(response));
            } catch (error) {
                console.error('Error fetching following', error);
            }
        },

        /**
         * Fetch all posts of this user
         */
        async fetchPosts() {
            const key = `posts-${this.thisUser.username}`;
            if (sessionStorage.getItem(key)) {
                this.posts = JSON.parse(sessionStorage.getItem(key) as string);
                return;
            }
            const postAPI = new PostApi();
            try {
                const response = await postAPI.getUserPosts(this.thisUser.username);
                if (response.errors) {
                    console.error('Error fetching posts', response.errors);
                    return;
                }
                this.posts = response;
                sessionStorage.setItem(key, JSON.stringify(response));
            } catch (error) {
                console.error('Error fetching posts', error);
            }
        },

        /**
         * Fetch all replies of this user
         */
        async fetchReplies() {
            const key = `replies-${this.thisUser.username}`;
            if (sessionStorage.getItem(key)) {
                this.replies = JSON.parse(sessionStorage.getItem(key) as string);
                return;
            }
            const postAPI = new PostApi();
            try {
                const response = await postAPI.getUserReplies(this.thisUser.username);
                if (response.errors) {
                    console.error('Error fetching replies', response.errors);
                    return;
                }
                this.replies = response;
                sessionStorage.setItem(key, JSON.stringify(response));
            } catch (error) {
                console.error('Error fetching replies', error);
            }
        },

        /**
         * Handle switch tab event
         */
        async handleTab(tab: string) {
            switch (tab) {
                case 'posts':
                    this.postTab = true;
                    this.repliesTab = false;
                    this.repostsTab = false;
                    break;
                case 'replies':
                    this.postTab = false;
                    this.repliesTab = true;
                    this.repostsTab = false;
                    await this.fetchReplies();
                    break;
                case 'reposts':
                    this.postTab = false;
                    this.repliesTab = false;
                    this.repostsTab = true;
                    break;
                default:
                    break;
            }
        },

        /**
        * Handle create post event
        */
        handleCreatePost() {
            this.showCreatePostModal = true;
        },

        /**
         * Handle follow event
         */
        async handleFollow() {
            // Load from localStorage if user already following
            const key = `following-${this.thisUser.id}`;
            if (localStorage.getItem(key)) {
                this.isFollowing = true;
                return;
            }

            // Follow user
            const followAPI = new FollowApi();
            try {
                const response = await followAPI.store(this.thisUser.id);
                if (response.errors) {
                    console.error('Error following user', response.errors);
                    return;
                }
                this.isFollowing = true;
                localStorage.setItem(`following-${this.thisUser.id}`, 'true');
            } catch (error) {
                console.error('Error following user', error);
                return;
            }
        },

        /**
         * Handle unfollow event
         */
        async handleUnfollow() {
            const followAPI = new FollowApi();
            try {
                const response = await followAPI.destroy(this.thisUser.id);
                if (response.errors) {
                    console.error('Error unfollowing user', response.errors);
                    return;
                }
                this.isFollowing = false;
                localStorage.removeItem(`following-${this.thisUser.id}`);
            } catch (error) {
                console.error('Error unfollowing user', error);
                return;
            }
        },

        /**
         * Handle edit profile event
         */
        handleEditProfile() {
            console.log('Edit Profile');
        },
    }
}
</script>