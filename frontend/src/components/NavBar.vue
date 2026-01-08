<template>
  <div :class="[
    'flex top-0 sticky rounded-md z-10 border-b justify-between px-10 py-2 mx-auto w-full lg:items-center lg:flex',
    theme === 'dark' ? 'border-stone-600 bg-black' : 'bg-white shadow-sm border-black'
  ]">
    <!-- Logo and Theme Toggle -->
    <div class="flex items-center justify-between py-3 lg:py-5 lg:block">
      <router-link to="/" class="text-2xl sm:text-3xl text-black-50 font-mono tracking-[0.1rem]">
        23:59'
      </router-link>
      <button @click="toggleTheme">
        <font-awesome-icon class="text-2xl sm:text-3xl" :icon="theme === 'dark' ? faSun : faMoon" />
      </button>
    </div>

    <!-- Navigation items -->
    <div class="hidden items-center lg:block">
      <ul class="list-none flex flex-row gap-14">
        <li v-for="(item, index) in navigationItems" :key="index">
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
            <font-awesome-icon class="px-4 py-3  text-2xl" :icon="item.icon" />
          </button>
        </li>
      </ul>
    </div>
    
    <!-- Sign in/up button -->
    <div class="flex items-center justify-between py-3 md:py-5 md:block">
      <router-link :to="authButtonLink" :class="[
          'flex items-center justify-center w-full h-full tracking-wider border px-3 py-1 rounded-xl',
          theme === 'dark' ?
            'text-white hover:text-stone-300 border-stone-500'
            : 'text-stone-700 hover:text-stone-500 border-stone-700'
        ]">
        {{ authButtonText }}
      </router-link>
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
import { faHome, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { user, theme, showCreatePostModal } from '../store.ts'

export default {
  name: 'NavBar',
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
    }
  },
  data() {
    return {
      components: false,
      user,
      theme,
    }
  },
    computed: {
    navigationItems() {
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
          link: this.user ? `/profile/${this.user.username}` : '/profile/null',
          isButton: false,
        },
      ]
    },
    authButtonLink() {
      switch (this.$route.path) {
        case '/sign-in':
          return '/sign-up'
        case '/sign-up':
          return '/sign-in'
        default:
          return '/sign-in'
      }
    },
    authButtonText() {
      switch (this.$route.path) {
        case '/sign-in':
          return 'Sign up'
        case '/sign-up':
          return 'Sign in'
        default:
          return 'Sign in'
      }
    },
  },
  methods: {
    toggleTheme() {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    },
    handlePlusClick() {
      if (!this.user || !this.user.id) {
        this.$router.push('/sign-in');
        return;
      }
      showCreatePostModal.value = true;
    },
  },
}
</script>