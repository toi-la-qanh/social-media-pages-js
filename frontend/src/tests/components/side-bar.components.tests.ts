import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { makeRouterMocks } from './_components.helpers'

export class SideBarComponentTests {
  static register() {
    it('SideBar.vue mounts', async () => {
      vi.resetModules()
      const SideBar = (await import('../../components/SideBar.vue')).default

      const wrapper = shallowMount(SideBar, {
        global: {
          stubs: { RouterLink: true },
          mocks: makeRouterMocks(),
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


