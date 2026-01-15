import { describe, expect, it, vi } from 'vitest'

describe('PostApi', () => {
  it('builds correct endpoints', async () => {
    sessionStorage.setItem('language', 'en')
    vi.resetModules()

    const getMock = vi.fn()
    const postMock = vi.fn()
    const patchMock = vi.fn()
    const deleteMock = vi.fn()

    vi.doMock('../../api/base.api', () => {
      class BaseApi {
        get(url: string, params: any = null) {
          return getMock(url, params)
        }
        post(url: string, data: any, params: any = null) {
          return postMock(url, data, params)
        }
        patch(url: string, data: any, params: any = null) {
          return patchMock(url, data, params)
        }
        delete(url: string, data: any = null, params: any = null) {
          return deleteMock(url, data, params)
        }
      }
      return { default: BaseApi }
    })

    const PostApi = (await import('../../api/post.api')).default
    const api = new PostApi()

    api.index()
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts?current_page=1&total_pages=10'), { lang: 'en' })

    api.index(2, 20)
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts?current_page=2&total_pages=20'), { lang: 'en' })

    api.store({ content: 'hi' })
    expect(postMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts'), { content: 'hi' }, { lang: 'en' })

    api.show('p1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1'), { lang: 'en' })

    api.showReplies('p1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/replies'), { lang: 'en' })

    api.update('p1', { content: 'edit' })
    expect(patchMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1'), { content: 'edit' }, { lang: 'en' })

    api.destroy('p1')
    expect(deleteMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1'), { lang: 'en' }, null)

    api.getCountOfReplies('p1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/replies/count'), { lang: 'en' })

    api.createReply('p1', { content: 'reply' })
    expect(postMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/replies'), { content: 'reply' }, { lang: 'en' })

    api.getUserPosts('alice')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/users/alice/posts'), { lang: 'en' })

    api.getUserReplies('alice')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/users/alice/replies'), { lang: 'en' })
  })
})


