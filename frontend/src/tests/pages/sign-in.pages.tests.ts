import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class SignInPageTests {
  static register() {
    it('SignIn.vue mounts', async () => {
      vi.resetModules()
      const SignIn = (await import('../../pages/SignIn.vue')).default
      const wrapper = shallowMount(SignIn, {
        global: {
          stubs: { RouterLink: true },
          mocks: {
            $router: { push: vi.fn() },
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  }
}


