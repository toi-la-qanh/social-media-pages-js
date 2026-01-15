import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class PublicLayoutTests {
  static register() {
    it('Public.vue mounts for guest and authed users', async () => {
      vi.resetModules()

      const store = await import('../../store')
      const Public = (await import('../../layouts/Public.vue')).default

      // guest branch
      store.user.value = { username: null, full_name: null, id: null, image_url: null }
      const guestWrapper = shallowMount(Public, {
        global: {
          stubs: {
            RouterView: true,
            NavBar: true,
            SideBar: true,
            Footer: true,
          },
        },
      })
      expect(guestWrapper.exists()).toBe(true)

      // authed branch
      store.user.value = { username: 'alice', full_name: 'Alice', id: 'u1', image_url: null }
      const authedWrapper = shallowMount(Public, {
        global: {
          stubs: {
            RouterView: true,
            NavBar: true,
            SideBar: true,
            Footer: true,
          },
        },
      })
      expect(authedWrapper.exists()).toBe(true)
    })
  }
}


