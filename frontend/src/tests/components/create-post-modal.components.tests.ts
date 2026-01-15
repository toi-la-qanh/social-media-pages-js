import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { makeRouterMocks } from './_components.helpers'

export class CreatePostModalComponentTests {
  static register() {
    it('CreatePostModal.vue mounts (with mocked OthersApi.getEmojis)', async () => {
      vi.resetModules()

      vi.doMock('../../api/others.api', () => ({
        default: {
          getEmojis: vi.fn().mockResolvedValue([]),
        },
      }))

      const CreatePostModal = (await import('../../components/CreatePostModal.vue')).default
      const wrapper = shallowMount(CreatePostModal, {
        global: {
          mocks: makeRouterMocks(),
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


