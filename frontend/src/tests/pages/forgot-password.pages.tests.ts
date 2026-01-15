import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class ForgotPasswordPageTests {
  static register() {
    it('ForgotPassword.vue mounts', async () => {
      vi.resetModules()
      const ForgotPassword = (await import('../../pages/ForgotPassword.vue')).default
      const wrapper = shallowMount(ForgotPassword, {
        global: {
          mocks: {
            $router: { push: vi.fn() },
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  }
}


