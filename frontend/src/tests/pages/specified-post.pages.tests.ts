import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { flushPromises, makeSocket } from './_pages.helpers'

export class SpecifiedPostPageTests {
  static register() {
    it('SpecifiedPost.vue mounts with APIs + $socket mocked', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async show() {
            return {
              id: 'p1',
              author_id: 'u1',
              author_name: 'alice',
              author_image_url: null,
              created_at: 'now',
              content: 'hi',
              views: 0,
              likes: 0,
              replies_count: 0,
              retweets_count: 0,
            }
          }
          async showReplies() {
            return []
          }
          async getCountOfReplies() {
            return { count: 0 }
          }
        }
        return { default: PostApi }
      })
      vi.doMock('../../api/like.api', () => {
        class LikeApi {
          async getLikesOfPost() {
            return { count: 0 }
          }
        }
        return { default: LikeApi }
      })
      vi.doMock('../../api/retweet.api', () => {
        class RetweetApi {
          async getCountOfRetweets() {
            return { count: 0 }
          }
        }
        return { default: RetweetApi }
      })

      const SpecifiedPost = (await import('../../pages/SpecifiedPost.vue')).default
      const wrapper = shallowMount(SpecifiedPost, {
        global: {
          stubs: { RouterLink: true },
          mocks: {
            $route: { params: { id: 'p1' } },
            $router: { back: vi.fn() },
            $socket: makeSocket(),
          },
        },
      })
      await flushPromises()
      expect(wrapper.exists()).toBe(true)
    })
  }
}


