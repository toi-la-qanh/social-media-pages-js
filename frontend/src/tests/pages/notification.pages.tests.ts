import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { makeSocket } from './_pages.helpers'

export class NotificationPageTests {
  static register() {
    it('Notification.vue mounts ($socket mocked)', async () => {
      vi.resetModules()
      const Notification = (await import('../../pages/Notification.vue')).default
      const wrapper = shallowMount(Notification, {
        global: {
          mocks: {
            $socket: makeSocket(),
          },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  }
}


