import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { store } from "@/store";

export default function AuthNavigationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (to.meta.noAuth) {
    next();

    return;
  }

  if (store === undefined || !store.getters["UserModule/loggedIn"]) {
    next("/");

    return;
  }

  if (to.path === "/") {
    next("/explore");
  }

  next();
}
