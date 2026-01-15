import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class ResetPasswordPageTests {
  static register() {
    it('ResetPassword.vue mounts', async () => {
      vi.resetModules()
      const ResetPassword = (await import('../../pages/ResetPassword.vue')).default
      const wrapper = shallowMount(ResetPassword, {
        global: {
          mocks: {
            $route: { params: { token: 't1' } },
            $router: { push: vi.fn() },
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  }
}


