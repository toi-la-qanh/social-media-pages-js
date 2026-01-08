<template>
  <router-view />
  <!-- Loading -->
  <Loading v-if="isLoading" />
  <!-- Create Post Modal -->
  <CreatePostModal v-if="showCreatePostModal" />
  <!-- Settings Modal -->
  <SettingsModal v-if="showSettingsModal" />
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { isLoading, showCreatePostModal, showSettingsModal } from './store.ts';

export default {
  components: {
    Loading: defineAsyncComponent(() => import('./components/Loading.vue')),
    CreatePostModal: defineAsyncComponent(() => import('./components/CreatePostModal.vue')),
    SettingsModal: defineAsyncComponent(() => import('./components/SettingsModal.vue')),
  },
  setup() {
    return {
      isLoading,
      showCreatePostModal,
      showSettingsModal,
    };
  },
};
</script>