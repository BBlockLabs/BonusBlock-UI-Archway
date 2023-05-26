import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AuthNavigationGuard from "@/router/AuthNavigationGuard";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: "/wallets",
      name: "wallets",
      component: () => import("@/views/WalletsView.vue"),
    },
    {
      path: "/referral",
      name: "Referral",
      component: () => import("@/views/ReferralView.vue"),
    },
    {
      path: "/collect-rewards",
      name: "Collect Rewards",
      component: () => {
        if (import.meta.env.MODE === "PRODUCTION") {
          return import("@/views/CollectRewardsComingSoon.vue");
        } else {
          return import("@/views/CollectRewardsView.vue");
        }
      },
    },
  ],
});

router.beforeEach(AuthNavigationGuard);

export default router;
