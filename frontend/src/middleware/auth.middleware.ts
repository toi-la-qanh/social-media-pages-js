import UserApi from "../api/user.api";
import {
  isLoading,
  user,
} from "../store.ts";

const userApi = new UserApi();

export default async function authMiddleware(to: any, from: any, next: any) {
  void from;
  isLoading.value = true;

  const isAuthenticated = !!user.value && user.value.id !== null;

  // Guest-only → redirect if logged in
  if (to.meta.guestOnly) {
    if (isAuthenticated) {
      isLoading.value = false;
      return next({ name: "Home" });
    }
    isLoading.value = false;
    return next();
  }

  // Always call the user API to get the user data
  try {
    const response = await userApi.getUser();
    console.log(response);
    if (response.errors) {
      isLoading.value = false;

      // Public routes not require authentication
      if (to.meta.public) {
        isLoading.value = false;
        return next();
      }
      return next({ name: "Sign In" });
    }

    // Set user data to store
    user.value = {
      id: response.id,
      username: response.username,
      full_name: response.full_name,
      image_url: response.image_url,
    };

    isLoading.value = false;
    return next();
  } catch (error) {
    isLoading.value = false;
    return next({ name: "Sign In" });
  }
}