<template>
  <div :class="[
    'flex shadow-sm z-10 border-t h-16 w-full fixed bottom-0 lg:hidden',
    theme === 'dark' ? 'border-stone-600 bg-stone-900' : 'border-stone-500 bg-white'
  ]">
    <ul class="list-none flex w-full flex-row justify-between h-full items-center">
      <li v-for="(item, index) in navigationItems" :key="index" class="flex h-full flex-1">
        <router-link v-if="!item.isButton" :to="item.link" :class="['flex items-center justify-center w-full h-full font-light tracking-wider ease-out duration-300',
          $route.path === item.link
            ? [
              theme === 'dark' ? 'text-stone-200 hover:bg-stone-900' : 'hover:bg-stone-200'
            ]
            : [
              theme === 'dark' ? 'text-stone-700 hover:bg-stone-900' : 'text-stone-400 hover:bg-stone-200'
            ]
        ]">
          <font-awesome-icon class="px-4 py-4 text-2xl" :icon="item.icon" />
        </router-link>

        <!-- Create Post Button -->
        <button v-else @click="handlePlusClick" :class="[
          'flex items-center justify-center w-full h-full font-light tracking-wider ease-out duration-300',
          theme === 'dark' ?
            'bg-stone-800 text-stone-700 hover:text-stone-300'
            : 'bg-stone-200 text-stone-400 hover:text-stone-700'
        ]">
          <font-awesome-icon class="px-4 py-3 text-2xl" :icon="item.icon" />
        </button>
      </li>
    </ul>
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
import { user, showCreatePostModal, theme } from '../store.ts'

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
  },
  methods: {
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