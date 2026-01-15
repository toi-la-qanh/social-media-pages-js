import { ref } from "vue";

type User = {
  username: string | null;
  full_name: string | null;
  id: string | null;
  image_url: string | null;
};

export const authError = ref(null);
export const showCreatePostModal = ref(false);
export const showCreateReplyModal = ref(false);
export const user = ref<User>({
  username: null,
  full_name: null,
  id: null,
  image_url: null,
});
export const errorMessages = ref(null);
export const isLoading = ref(false);
export const theme = ref("light");
export const showSettingsModal = ref(false);
export const language = ref(sessionStorage.getItem('language') || 'en');