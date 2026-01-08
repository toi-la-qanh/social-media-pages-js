<template>
  <div :class="[
    'min-h-screen',
    theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'
  ]">
    <NavBar />
    <div class="w-full flex justify-center h-full pb-20 lg:pb-5">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { theme } from '../store.ts'

export default {
  name: 'Guest',
  components: {
    NavBar,
    Footer,
  },
  data() {
    return {
      theme,
    }
  }
};
</script>