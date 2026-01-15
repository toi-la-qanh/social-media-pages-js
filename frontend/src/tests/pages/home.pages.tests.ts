import { expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { flushPromises, makeSocket } from './_pages.helpers'

function makeDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: any) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const FontAwesomeIconStub = {
  name: 'FontAwesomeIcon',
  props: ['icon'],
  template: `<i :data-icon="(icon && (icon.iconName || (Array.isArray(icon) ? icon[1] : icon))) || ''"></i>`,
}

const RouterLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: `<a><slot /></a>`,
}

export class HomePageTests {
  static register() {
    it('Home.vue shows empty state when API returns no posts', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async index() {
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
          async checkIfLiked() {
            return { liked: false }
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

      const Home = (await import('../../pages/Home.vue')).default
      const wrapper = mount(Home, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
            FontAwesomeIcon: FontAwesomeIconStub,
            'font-awesome-icon': FontAwesomeIconStub,
          },
          mocks: {
            $socket: makeSocket(),
          },
        },
      })

      await flushPromises()
      expect(wrapper.text()).toContain('No posts available')
    })

    it('Home.vue renders posts returned by API', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      const posts = [
        {
          id: 'p1',
          author_name: 'alice',
          author_image_url: null,
          created_at: 'now',
          content: 'hello world',
          image_url: '',
        },
      ]

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async index() {
            return posts
          }
          async getCountOfReplies() {
            return { count: 2 }
          }
        }
        return { default: PostApi }
      })
      vi.doMock('../../api/like.api', () => {
        class LikeApi {
          async getLikesOfPost() {
            return { count: 1 }
          }
          async checkIfLiked() {
            return { liked: false }
          }
        }
        return { default: LikeApi }
      })
      vi.doMock('../../api/retweet.api', () => {
        class RetweetApi {
          async getCountOfRetweets() {
            return { count: 3 }
          }
        }
        return { default: RetweetApi }
      })

      const Home = (await import('../../pages/Home.vue')).default
      const wrapper = mount(Home, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
            FontAwesomeIcon: FontAwesomeIconStub,
            'font-awesome-icon': FontAwesomeIconStub,
          },
          mocks: {
            $socket: makeSocket(),
          },
        },
      })

      await flushPromises()
      expect(wrapper.text()).toContain('hello world')
    })

    it('Home.vue click on "create post" opens create-post modal (output via store)', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      const store = await import('../../store')
      store.user.value = { username: 'alice', full_name: 'Alice', id: 'u1', image_url: null } as any
      store.showCreatePostModal.value = false

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async index() {
            return [
              { id: 'p1', author_name: 'alice', author_image_url: null, created_at: 'now', content: 'hi', image_url: '' },
            ]
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
          async checkIfLiked() {
            return { liked: false }
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

      const Home = (await import('../../pages/Home.vue')).default
      const wrapper = mount(Home, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
            FontAwesomeIcon: FontAwesomeIconStub,
            'font-awesome-icon': FontAwesomeIconStub,
          },
          mocks: {
            $socket: makeSocket(),
          },
        },
      })

      await flushPromises()

      const createButton = wrapper.findAll('button').find((b) => b.text().includes('Post'))
      expect(createButton, 'Expected create-post button to exist when user is logged in').toBeTruthy()
      await createButton!.trigger('click')
      expect(store.showCreatePostModal.value).toBe(true)
    })

    it('Home.vue clicking reply opens reply modal (renders CreateReplyModal with selected post)', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      const store = await import('../../store')
      store.showCreateReplyModal.value = false

      const post = {
        id: 'p1',
        author_name: 'alice',
        author_image_url: null,
        created_at: 'now',
        content: 'hi',
        image_url: '',
      }

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async index() {
            return [post]
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
          async checkIfLiked() {
            return { liked: false }
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

      const Home = (await import('../../pages/Home.vue')).default
      const wrapper = mount(Home, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
            FontAwesomeIcon: FontAwesomeIconStub,
            'font-awesome-icon': FontAwesomeIconStub,
            CreateReplyModal: {
              name: 'CreateReplyModal',
              props: ['post'],
              template: `<div data-testid="create-reply-modal"></div>`,
            },
          },
          mocks: {
            $socket: makeSocket(),
          },
        },
      })

      await flushPromises()

      // Click the reply icon (event bubbles to the surrounding <button @click="openReply(post)">)
      const replyIcon = wrapper.find('i[data-icon="comment"]')
      await replyIcon.trigger('click')

      const modal = wrapper.find('[data-testid="create-reply-modal"]')
      expect(modal.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'CreateReplyModal' }).props('post')).toMatchObject({ id: 'p1' })
    })

    it('Home.vue clicking like calls LikeApi.store and emits socket event', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      const socket = makeSocket()
      const store = await import('../../store')
      store.user.value = { username: 'alice', full_name: 'Alice', id: 'u1', image_url: null } as any

      const storeLikeMock = vi.fn().mockResolvedValue({})

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async index() {
            return [{ id: 'p1', author_name: 'alice', author_image_url: null, created_at: 'now', content: 'hi', image_url: '' }]
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
          async checkIfLiked() {
            return { liked: false }
          }
          async store(postId: string) {
            return storeLikeMock(postId)
          }
          async destroy() {
            return {}
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

      const Home = (await import('../../pages/Home.vue')).default
      const wrapper = mount(Home, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
            FontAwesomeIcon: FontAwesomeIconStub,
            'font-awesome-icon': FontAwesomeIconStub,
          },
          mocks: {
            $socket: socket,
          },
        },
      })

      await flushPromises()

      const heartIcon = wrapper.find('i[data-icon="heart"]')
      await heartIcon.trigger('click')

      expect(storeLikeMock).toHaveBeenCalledWith('p1')
      expect(socket.emit).toHaveBeenCalledWith('like', 'p1')
    })

    it('Home.vue shows error state when PostApi.index throws', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async index() {
            throw 'Boom'
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
          async checkIfLiked() {
            return { liked: false }
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

      const Home = (await import('../../pages/Home.vue')).default
      const wrapper = mount(Home, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
            FontAwesomeIcon: FontAwesomeIconStub,
            'font-awesome-icon': FontAwesomeIconStub,
          },
          mocks: {
            $socket: makeSocket(),
          },
        },
      })

      await flushPromises()
      expect(wrapper.text()).toContain('Boom')
    })

    it('Home.vue shows "Loading more posts..." while fetching next page after scroll', async () => {
      vi.resetModules()
      sessionStorage.setItem('language', 'en')

      const deferred = makeDeferred<any[]>()
      let indexCall = 0

      vi.doMock('../../api/post.api', () => {
        class PostApi {
          async index() {
            indexCall += 1
            if (indexCall === 1) {
              // 10 posts => hasMorePages stays true
              return Array.from({ length: 10 }).map((_, i) => ({
                id: `p${i + 1}`,
                author_name: 'alice',
                author_image_url: null,
                created_at: 'now',
                content: `post ${i + 1}`,
                image_url: '',
              }))
            }
            return deferred.promise
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
          async checkIfLiked() {
            return { liked: false }
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

      const Home = (await import('../../pages/Home.vue')).default
      const wrapper = mount(Home, {
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
            FontAwesomeIcon: FontAwesomeIconStub,
            'font-awesome-icon': FontAwesomeIconStub,
          },
          mocks: {
            $socket: makeSocket(),
          },
        },
      })

      await flushPromises()

      // Trigger scroll near bottom (contract: should attempt pagination)
      Object.defineProperty(wrapper.element, 'scrollTop', { value: 900, writable: true })
      Object.defineProperty(wrapper.element, 'scrollHeight', { value: 1000, writable: true })
      Object.defineProperty(wrapper.element, 'clientHeight', { value: 50, writable: true })
      await wrapper.trigger('scroll')
      await flushPromises()

      // While promise is pending, show loading-more indicator
      const loadingMore = wrapper.findAll('div').find((d) => d.text().trim() === '...')
      expect(loadingMore, 'Expected loading-more indicator to be visible while next-page request is pending').toBeTruthy()

      deferred.resolve([])
      await flushPromises()

      const loadingMoreAfter = wrapper.findAll('div').find((d) => d.text().trim() === '...')
      expect(loadingMoreAfter, 'Expected loading-more indicator to disappear once next-page request resolves').toBeFalsy()
    })
  }
}
