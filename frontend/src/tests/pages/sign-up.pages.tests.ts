import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class SignUpPageTests {
  static register() {
    it('SignUp.vue mounts', async () => {
      vi.resetModules()
      const SignUp = (await import('../../pages/SignUp.vue')).default
      const wrapper = shallowMount(SignUp, {
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


