import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { makeRouterMocks } from './_components.helpers'

export class SettingsModalComponentTests {
  static register() {
    it('SettingsModal.vue mounts', async () => {
      vi.resetModules()
      const SettingsModal = (await import('../../components/SettingsModal.vue')).default

      const wrapper = shallowMount(SettingsModal, {
        global: {
          mocks: makeRouterMocks(),
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


