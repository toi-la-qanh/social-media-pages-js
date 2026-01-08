<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeModal">
    <div :class="['sm:rounded-3xl h-full w-full sm:max-w-xl sm:h-auto overflow-x-hidden',
      theme === 'dark' ? 'bg-stone-900 text-white' : 'bg-white  shadow-xl text-black'
    ]">
      <!-- Header -->
      <div class="flex items-center justify-between px-7 py-3 border-b"
        :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'">
        <button @click="closeModal" class="text-base hover:text-gray-500">
          Cancel
        </button>
        <h2 class="text-base font-bold">New Post</h2>
        <div class="flex flex-row items-center gap-2">
          <!-- Drafts -->
          <button>
            <font-awesome-icon class="text-xl" :icon="faFileLines" />
          </button>
          <!-- Post Options -->
          <button>
            <font-awesome-icon :class="[
              'h-8 w-8 rounded-full border p-1',
              theme === 'dark' ? 'border-gray-700 text-white' : 'border-black text-black'
            ]" :icon="faEllipsis" />
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col py-3 px-6 gap-3 items-center">
        <div class="flex flex-row items-center gap-2 w-full">
          <!-- Images Column -->
          <div class="flex flex-col items-center justify-center gap-2">
            <!-- Big Image -->
            <img :src="user.image_url || '/default-avatar.png'" alt="User Image"
              class="sm:w-10 sm:h-10 w-8 h-8 object-cover rounded-full">
            <!-- Border between images -->
            <div :class="[
              'border-l-3 h-8',
              theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
            ]"></div>
            <!-- Small Image -->
            <img :src="user.image_url || '/default-avatar.png'" alt="User Image"
              class="w-4 h-4 object-cover rounded-full">
          </div>

          <!-- Content -->
          <div class="flex flex-col gap-2 w-full">
            <!-- Username and Inputs -->
            <div class="flex flex-col text-sm sm:text-base">
              <div class="flex flex-row items-center gap-2">
                <p class="font-bold">{{ user.username }}</p>
                <font-awesome-icon class="text-gray-500" :icon="faAngleRight" />
                <input v-model="topic" type="text" placeholder="Add a topic" class="outline-none">
              </div>
              <input v-model="content" type="text" placeholder="What's on your mind?" class="outline-none">
            </div>

            <!-- Option Icons -->
            <div class="w-full flex flex-row items-center gap-2 sm:text-base text-sm text-gray-400">
              <label for="fileInput" class="cursor-pointer">
                <font-awesome-icon :icon="faImage" />
                <input id="fileInput" type="file" accept="image/*" class="hidden">
              </label>
              <button type="button" @click="showEmojisModal()" ref="emojiButton">
                <font-awesome-icon :icon="faFaceSmile" />
              </button>
              <button type="button">
                <font-awesome-icon :icon="faAlignLeft" />
              </button>
              <button type="button">
                <font-awesome-icon :icon="faLocationDot" />
              </button>
            </div>

            <!-- Add to Post -->
            <p class="text-sm text-gray-400">Add to Post</p>
          </div>
        </div>

        <!-- Post Buttons -->
        <div class="flex flex-row items-center justify-between w-full">
          <button :class="['flex flex-row items-center gap-2 text-sm',
            theme === 'dark' ? 'text-white' : 'text-stone-400'
          ]" type="button">
            <font-awesome-icon class="border-2 rounded-sm p-1" :icon="faUpDown" />
            <p class="font-bold">Reply Options</p>
          </button>
          <button :class="['flex flex-row items-center font-bold gap-2 text-sm border py-2 px-5 rounded-lg',
            theme === 'dark' ? 'text-white' : 'border-stone-300'
          ]" type="submit">
            Post
          </button>

        </div>

        <!-- Form Errors -->
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>
      </form>

      <!-- Emojis -->
      <div v-if="emojis.length > 0 && showEmojis" 
        class="fixed inset-0 z-60"
        @click.self="closeEmojisModal()">
        <div ref="emojiPanel" :class="[
          'absolute max-w-96 max-h-50 overflow-y-auto p-2 border rounded-xl',
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
        ]" :style="emojiPanelStyle">
          <div class="grid grid-cols-5 gap-1">
            <button v-for="(emoji, index) in emojis" :key="index" @click.stop="addEmojiToContent(emoji)" :class="[
              'text-2xl p-2 rounded transition-colors',
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            ]">
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { faFaceSmile, faFileLines } from '@fortawesome/free-regular-svg-icons';
import { user, theme, showCreatePostModal } from '../store.ts';
import { faAlignLeft, faAngleRight, faEllipsis, faImage, faLocationDot, faUpDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import OthersApi from '../api/others.api';
import PostApi from '../api/post.api';

export default {
  name: 'CreatePostModal',
  components: {
    FontAwesomeIcon,
  },
  setup() {
    return {
      user,
      theme,
      faEllipsis,
      faAngleRight,
      faImage,
      faFaceSmile,
      faLocationDot,
      faUpDown,
      faAlignLeft,
      faFileLines,
    };
  },
  data() {
    return {
      error: null as string | null,
      success: null as string | null,
      emojis: [] as any,
      showEmojis: false,
      content: '',
      topic: '',
      emojiPanelStyle: {} as any,
    };
  },
  async mounted() {
    await this.getEmojis();
  },
  methods: {
    /**
     * Close this component
     */
    closeModal() {
      showCreatePostModal.value = false;
    },

    /**
     * Call API to create a new post
     */
    async handleSubmit() {
      const postApi = new PostApi();
      try {
        const response = await postApi.store({ content: this.content });
        if (response.errors) {
          this.error = response.errors;
          return;
        }
        this.content = '';
        this.topic = '';
        this.closeModal();
        // Emit event to refresh posts in Home.vue
        window.dispatchEvent(new Event('post-created'));
      } catch (error) {
        console.error('Error creating post:', error);
      }
    },

    /**
     * Fetch free emojis
     */
    async getEmojis() {
      // Fetch from local storage if available
      const emojis = localStorage.getItem('emojis');
      if (emojis) {
        this.emojis = JSON.parse(emojis);
        return;
      }

      // Fetch from API if not available
      try {
        const response = await OthersApi.getEmojis();
        if (response.errors) {
          this.error = response.errors;
          return;
        }
        this.emojis = response;
        localStorage.setItem('emojis', JSON.stringify(response));
      } catch (error) {
        console.error('Error fetching emojis:', error);
      }
    },

    /**
     * Show the emojis modal
     */
    showEmojisModal() {
      this.showEmojis = true;
      // Position the emoji panel below the button
      this.$nextTick(() => {
        const button = this.$refs.emojiButton as HTMLElement;
        if (button) {
          const rect = button.getBoundingClientRect();
          this.emojiPanelStyle = {
            top: `${rect.bottom + 5}px`,
            left: `${rect.left}px`,
            scrollbarWidth: 'none',
          };
        }
      });
    },

    /**
     * Close the emojis modal
     */
    closeEmojisModal() {
      this.showEmojis = false;
    },

    /**
     * Add an emoji to the content
     */
    addEmojiToContent(emoji: string) {
      this.content += emoji;
    }
  },
};
</script>
