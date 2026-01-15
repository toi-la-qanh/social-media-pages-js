import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { makeRouterMocks } from './_components.helpers'

export class NavBarComponentTests {
  static register() {
    it('NavBar.vue mounts', async () => {
      vi.resetModules()
      const NavBar = (await import('../../components/NavBar.vue')).default

      const wrapper = shallowMount(NavBar, {
        global: {
          stubs: { RouterLink: true },
          mocks: makeRouterMocks(),
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


