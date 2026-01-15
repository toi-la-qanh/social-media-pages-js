import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class GuestLayoutTests {
  static register() {
    it('Guest.vue mounts', async () => {
      vi.resetModules()
      const Guest = (await import('../../layouts/Guest.vue')).default

      const wrapper = shallowMount(Guest, {
        global: {
          stubs: {
            RouterView: true,
            NavBar: true,
            Footer: true,
          },
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


