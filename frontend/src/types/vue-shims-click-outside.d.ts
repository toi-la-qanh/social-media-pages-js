declare module 'v-click-outside' {
  import { DirectiveBinding } from 'vue';
  
  interface ClickOutsideDirective {
    directive: {
      mounted(el: HTMLElement, binding: DirectiveBinding): void;
      unmounted(el: HTMLElement, binding: DirectiveBinding): void;
    };
  }
  
  const vClickOutside: ClickOutsideDirective;
  export default vClickOutside;
}

