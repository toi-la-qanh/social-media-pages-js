<template>
  <div :class="[
    'max-h-[500px] lg:min-h-[550px] lg:w-3/7 sm:w-9/11 md:mb-0 m-4 w-full rounded-3xl border py-3 overflow-y-auto',
    theme === 'dark' ? 'bg-stone-900/80 border-gray-800' : 'bg-white border-gray-300'
  ]" style="scrollbar-width: none;">
    <!-- Input Component -->
    <div class="block w-full h-18 px-7 py-3">
      <div :class="[
        'flex items-center justify-between border w-full h-full rounded-2xl px-6',
        theme === 'dark' ? 'border-gray-700 bg-black' : 'border-gray-300 bg-stone-50'
      ]">
        <div class="flex items-center gap-2 w-full">
          <font-awesome-icon :class="[
            'text-base',
            theme === 'dark' ? 'text-stone-600' : 'text-stone-400'
          ]" :icon="faSearch" />
          <input v-model="query" @input="searchUsers" type="text" :placeholder="$t('search.input')"
            class="w-full h-full outline-none">
        </div>
        <font-awesome-icon :class="[
          'text-base',
          theme === 'dark' ? 'text-stone-600' : 'text-stone-400'
        ]" :icon="faSliders" />
      </div>
    </div>

    <!-- Message -->
    <div v-if="message" class="text-center text-stone-400">{{ message }}</div>

    <!-- Results -->
    <div v-if="users && users.length > 0" class="flex flex-col gap-4 h-full min-h-96">
      <router-link v-for="(user, index) in users" 
      :key="user.id" 
      class="flex flex-row gap-4 pl-7 pt-2"
      :to="`/profile/${user.username}`">
        <!-- Image Column -->
        <div class="flex-shrink-0">
          <img :src="user.image_url" alt="User Image" class="w-10 h-10 rounded-full">
        </div>

        <!-- User Data Column -->
        <div :class="[
          'flex flex-col w-full pb-3 border-b sm:text-[15px] text-[13px]',
          index !== users.length - 1 ? '' : 'border-b-0',
          theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
        ]">
          <div class="flex flex-row sm:justify-between w-full">
            <!-- Username and Full Name -->
            <div class="flex flex-col w-full">
              <p class="font-bold">{{ user.username }}</p>
              <p :class="[
                'sm:text-[15px] text-[13px]',
                theme === 'dark' ? 'text-stone-600' : 'text-stone-400'
              ]">{{ user.full_name }}</p>
            </div>

            <!-- Follow Button -->
            <div class="relative right-0 pr-5">
              <button :class="[
                'border rounded-xl px-6 py-1.5 min-w-30 font-bold',
                theme === 'dark' ? 'border-gray-700' : 'border-none bg-black text-white'
              ]">{{ $t('search.buttons.follow') }}</button>
            </div>
          </div>

          <!-- Bio -->
          <p class="">{{ user.bio }}</p>

          <!-- Followers Count -->
          <p class="text-stone-400">{{ user.followers_count }} {{ $t('search.followersCountText') }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch, faSliders } from '@fortawesome/free-solid-svg-icons';
import { isLoading, theme } from '../store.ts';
import UserApi from '../api/user.api';
export default {
  name: 'Post',
  components: {
    FontAwesomeIcon,
  },
  setup() {
    return { faSearch, faSliders }
  },
  data() {
    return {
      message: null,
      users: [] as any,
      theme,
      query: '',
      isLoading,
    }
  },
  methods: {
    async searchUsers() {
      if (!this.query || this.query.trim() === '') {
        this.users = [];
        this.message = null;
        return;
      }

      this.isLoading = true;
      this.message = null;
      const userApi = new UserApi();
      try {
        const response = await userApi.search(this.query);
        if (response.errors) {
          return;
        }
        if (response.message) {
          this.message = response.message;
          return;
        }
        this.users = response;
      } catch (error: any) {
        console.error('Error searching users:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>
