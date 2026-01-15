import { expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

export class SearchPageTests {
  static register() {
    it('Search.vue mounts (UserApi.search mocked)', async () => {
      vi.resetModules()
      vi.doMock('../../api/user.api', () => {
        class UserApi {
          async search() {
            return []
          }
        }
        return { default: UserApi }
      })

      const Search = (await import('../../pages/Search.vue')).default
      const wrapper = shallowMount(Search, {
        global: {
          stubs: { RouterLink: true },
        },
      })
      expect(wrapper.exists()).toBe(true)
    })
  }
}


