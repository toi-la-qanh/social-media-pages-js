import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { makeRouterMocks } from './_components.helpers'

export class CreateReplyModalComponentTests {
  static register() {
    it('CreateReplyModal.vue mounts (with mocked OthersApi.getEmojis)', async () => {
      vi.resetModules()

      vi.doMock('../../api/others.api', () => ({
        default: {
          getEmojis: vi.fn().mockResolvedValue([]),
        },
      }))

      const CreateReplyModal = (await import('../../components/CreateReplyModal.vue')).default
      const wrapper = shallowMount(CreateReplyModal, {
        props: {
          post: { id: 'p1', author_name: 'bob', author_image_url: null, created_at: 'now', content: 'hi' },
        },
        global: {
          mocks: makeRouterMocks(),
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  }
}


