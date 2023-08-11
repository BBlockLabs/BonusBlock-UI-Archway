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
      path: "/explore",
      name: "Explore",
      component: () => import("@/views/ExploreView.vue"),
    },
    {
      path: "/referral",
      name: "Referral",
      component: () => import("@/views/ReferralView.vue"),
    },
    {
      path: "/product/:id",
      name: "Product",
      component: () => import("@/views/ProductDetails.vue"),
    },
    {
      path: "/collect-rewards",
      name: "Collect Rewards",
      component: () => import("@/views/CollectRewardsView.vue"),
    },
    {
      path: "/leaderboard",
      name: "Leaderboard",
      component: () => import("@/views/LeaderboardView.vue"),
    },
    {
      path: "/archway",
      name: "Archway",
      component: () => import("@/views/ArchwayInfo.vue"),
    },
    {
      path: "/archway-analytics-dashboards",
      name: "Archway analytics dashboards",
      component: () => import("@/views/ArchwayAnalyticsDashboard.vue"),
    },
  ],
});

router.beforeEach(AuthNavigationGuard);

export default router;
