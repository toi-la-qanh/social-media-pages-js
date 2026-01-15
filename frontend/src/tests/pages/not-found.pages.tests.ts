import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class NotFoundPageTests {
  static register() {
    it('NotFound.vue mounts', async () => {
      vi.resetModules()
      const NotFound = (await import('../../pages/NotFound.vue')).default
      const wrapper = shallowMount(NotFound, {
        global: {
          mocks: {
            $router: { go: vi.fn() },
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  }
}


