import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class AuthLayoutTests {
  static register() {
    it('Auth.vue mounts', async () => {
      vi.resetModules()
      const Auth = (await import('../../layouts/Auth.vue')).default

      const wrapper = shallowMount(Auth, {
        global: {
          stubs: {
            RouterView: true,
            SideBar: true,
            Footer: true,
          },
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


