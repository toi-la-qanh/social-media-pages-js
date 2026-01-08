import { createRouter, createWebHistory } from "vue-router";
import authMiddleware from "../middleware/auth.middleware.ts";
import i18n from "../translation";

const createRoutes = () => {
  const t = i18n.global.t;
  
  return [
    // 🌐 Public Layout (everyone can access)
    {
      path: "/",
      component: () => import("../layouts/Public.vue"),
      meta: { public: true },
      children: [
        {
          path: "",
          name: t("routes.home"),
          component: () => import("../pages/Home.vue"),
        },
        {
          path: "search",
          name: t("routes.search"),
          component: () => import("../pages/Search.vue"),
        },
        {
          path: "post/:id",
          name: t("routes.post"),
          component: () => import("../pages/SpecifiedPost.vue"),
        },
        {
          path: "/:catchAll(.*)", // Catch-all route for 404
          name: t("routes.notFound"),
          component: () => import("../pages/NotFound.vue"),
        },
      ],
    },

    // 🔐 Auth Layout (requires auth)
    {
      path: "/",
      component: () => import("../layouts/Auth.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "notification",
          name: t("routes.notification"),
          component: () => import("../pages/Notification.vue"),
        },
        {
          path: "profile/:username",
          name: t("routes.profile"),
          component: () => import("../pages/Profile.vue"),
        },
      ],
    },

    // 🙅 Guest Layout (only for unauthenticated)
    {
      path: "/",
      component: () => import("../layouts/Guest.vue"),
      meta: { guestOnly: true },
      children: [
        {
          path: "sign-in",
          name: t("routes.signIn"),
          component: () => import("../pages/SignIn.vue"),
        },
        {
          path: "sign-up",
          name: t("routes.signUp"),
          component: () => import("../pages/SignUp.vue"),
        },
        {
          path: "forgot-password",
          name: t("routes.forgotPassword"),
          component: () => import("../pages/ForgotPassword.vue"),
        },
        {
          path: "reset-password/:token",
          name: t("routes.resetPassword"),
          component: () => import("../pages/ResetPassword.vue"),
        },
      ],
    },
  ];
};

const routes = createRoutes();

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  await authMiddleware(to, from, next);
});


export default router;