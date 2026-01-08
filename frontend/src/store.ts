import { ref } from "vue";

export const authError = ref(null);
export const showCreatePostModal = ref(false);
export const showCreateReplyModal = ref(false);
export const user = ref({
  username: null,
  full_name: null,
  id: null,
  image_url: null,
});
export const errorMessages = ref(null);
export const isLoading = ref(false);
export const theme = ref("light");
export const showSettingsModal = ref(false);