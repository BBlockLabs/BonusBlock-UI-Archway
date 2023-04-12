import "vue-router";
import "@/router/Meta";

declare module "vue-router" {
  interface RouteMeta extends Meta {}
}
