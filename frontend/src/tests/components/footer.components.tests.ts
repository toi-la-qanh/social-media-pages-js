import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { makeRouterMocks } from './_components.helpers'

export class FooterComponentTests {
  static register() {
    it('Footer.vue mounts', async () => {
      vi.resetModules()
      const Footer = (await import('../../components/Footer.vue')).default

      const wrapper = shallowMount(Footer, {
        global: {
          stubs: { RouterLink: true },
          mocks: makeRouterMocks(),
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


