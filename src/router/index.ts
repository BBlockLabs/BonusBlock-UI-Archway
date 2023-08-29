import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AuthNavigationGuard from "@/router/AuthNavigationGuard";
import Toast from "@/common/Toast";

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

router.beforeEach((to, from, next) => {
  if (to.query.why == "already_linked") {
    Toast.make("Already linked!", "Requested social profile is already linked to another account", "error", false, 3000);
    delete to.query.why;
    next({ path: to.path, query: to.query });
  } else {
    next();
  }
});

export default router;
