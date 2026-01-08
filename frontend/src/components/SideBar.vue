<template>
  <div class="top-0 sticky z-10 ml-1 w-full">
    <div class="flex flex-row items-center justify-center lg:justify-between px-2 gap-2 py-3 w-full">
      <!-- Logo and Theme Toggle -->
      <div class="hidden lg:flex flex-row items-center justify-between">
        <router-link to="/" class="text-2xl sm:text-3xl text-black-50 font-mono tracking-[0.1rem]">
          23:59'
        </router-link>
        <button @click="toggleTheme">
          <FontAwesomeIcon class="text-2xl sm:text-3xl" :icon="theme === 'dark' ? faSun : faMoon" />
        </button>
      </div>
      <div class="flex flex-row items-center justify-between w-full lg:w-5/7 sm:w-9/11">
        <!-- Back Button -->
        <button v-if="$route.path !== '/'" class="rounded-full p-1 w-7 h-7 flex items-center justify-center" :class="theme === 'dark'
          ? 'hover:text-gray-400'
          : 'hover:text-gray-500 border border-stone-300'" @click="$router.back()">
          <div>
          <font-awesome-icon class="text-xs" :icon="faArrowLeft" />
          </div>
        </button>
        <div v-if="$route.path === '/'" class="w-7"></div>

        <!-- Route Name -->
        <p class="text-base font-bold sm:text-lg">
          {{ $route.name }}
        </p>

        <div class="hidden w-30 lg:block"></div>

        <!-- Settings -->
        <button :class="[
          'lg:hidden block',
          theme === 'dark' ? 'text-stone-700 hover:text-stone-300' : 'text-stone-400 hover:text-stone-700'
        ]" @click="openSettingsModal">
          <font-awesome-icon class="text-2xl" :icon="faGear" />
        </button>

        <div class="lg:block w-24 hidden"></div>
      </div>
    </div>

    <!-- Sidebar Components -->
    <div class="absolute pt-16 lg:flex hidden h-screen">
      <ul class="flex flex-col list-none flex-1 gap-3">
        <li v-for="(item, index) in sidebarComponents" :key="index" class="w-auto h-auto ml-1">
          <router-link v-if="!item.isButton" :to="item.link" :class="[
            $route.path === item.link
              ? [
                'rounded-xl flex items-center justify-center w-full h-full font-light tracking-wider text-black ease-out duration-300',
                theme === 'dark' ? 'text-stone-200 hover:bg-stone-900' : 'hover:bg-stone-200'
              ]
              : [
                'rounded-xl flex items-center justify-center w-full h-full font-light tracking-wider ease-out duration-300',
                theme === 'dark' ? 'text-stone-700 hover:bg-stone-900' : 'text-stone-400 hover:bg-stone-200'
              ]
          ]">
            <font-awesome-icon class="px-4 py-4 text-2xl" :icon="item.icon" />
          </router-link>

          <!-- Create Post Button -->
          <button v-else @click="handlePlusClick" :class="[
            'rounded-xl flex items-center justify-center w-full h-full font-light tracking-wider ease-out duration-300',
            theme === 'dark' ? 'bg-stone-900 text-stone-700 hover:text-stone-300' : 'bg-stone-200 text-stone-400 hover:text-stone-700'
          ]">
            <font-awesome-icon class="px-4 py-3 text-2xl" :icon="item.icon" />
          </button>
        </li>
      </ul>

      <!-- Settings -->
      <button :class="[
        'absolute bottom-30 sm:flex hidden p-5',
        theme === 'dark' ? 'text-stone-700 hover:text-stone-300' : 'text-stone-400 hover:text-stone-700'
      ]" @click="openSettingsModal">
        <font-awesome-icon class="text-2xl" :icon="faGear" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faHeart,
  faMoon,
  faUser,
  faSun,
} from '@fortawesome/free-regular-svg-icons'
import { faGear, faHome, faPlus, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { user, theme, showCreatePostModal, showSettingsModal } from '../store.ts'

export default {
  name: 'SideBar',
  components: {
    FontAwesomeIcon,
  },
  setup() {
    return {
      faSun,
      faMoon,
      faHeart,
      faUser,
      faHome,
      faPlus,
      faSearch,
      faGear,
      faArrowLeft,
    }
  },
  data() {
    return {
      components: false,
      user,
      theme,
      showSettingsModal,
    }
  },
  computed: {
    sidebarComponents() {
      return [
        {
          icon: faHome,
          link: '/',
          isButton: false,
        },
        {
          icon: faSearch,
          link: '/search',
          isButton: false,
        },
        {
          icon: faPlus,
          link: '#',
          isButton: true,
        },
        {
          icon: faHeart,
          link: '/notification',
          isButton: false,
        },
        {
          icon: faUser,
          link: user.value ? `/profile/${this.user.username}` : '/profile/null',
          isButton: false,
        },
      ]
    },
  },
  methods: {
    toggleTheme() {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    },
    handlePlusClick() {
      if (!user.value || !user.value.id) {
        this.$router.push('/sign-in');
        return;
      }
      showCreatePostModal.value = true;
    },
    openSettingsModal() {
      showSettingsModal.value = true;
    },
  },
}
</script>