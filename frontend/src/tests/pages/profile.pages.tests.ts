import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { flushPromises } from './_pages.helpers'

export class ProfilePageTests {
  static register() {
    it('Profile.vue mounts with APIs mocked', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      vi.doMock('../../api/user.api', () => {
        class UserApi {
          async getThisUser() {
            return { id: 'u1', username: 'alice', full_name: 'Alice', image_url: null, bio: '' }
          }
        }
        return { default: UserApi }
      })
      vi.doMock('../../api/follow.api', () => {
        class FollowApi {
          async getFollowers() {
            return []
          }
          async getFollowing() {
            return []
          }
          async store() {
            return {}
          }
        }
        return { default: FollowApi }
      })
      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async getUserPosts() {
            return []
          }
          async getUserReplies() {
            return []
          }
        }
        return { default: PostApi }
      })

      const Profile = (await import('../../pages/Profile.vue')).default
      const wrapper = shallowMount(Profile, {
        global: {
          stubs: { RouterLink: true },
          mocks: {
            $route: { params: { username: 'alice' } },
            $router: { push: vi.fn() },
          },
        },
      })
      await flushPromises()
      expect(wrapper.exists()).toBe(true)
    })
  }
}


