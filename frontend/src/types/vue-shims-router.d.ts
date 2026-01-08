import 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { Router } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $route: RouteLocationNormalized;
    $router: Router;
  }
}

