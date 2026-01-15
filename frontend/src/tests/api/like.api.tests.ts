import { describe, expect, it, vi } from 'vitest'

describe('LikeApi', () => {
  it('builds correct endpoints', async () => {
    sessionStorage.setItem('language', 'en')
    vi.resetModules()

    const getMock = vi.fn()
    const postMock = vi.fn()
    const deleteMock = vi.fn()

    vi.doMock('../../api/base.api', () => {
      class BaseApi {
        get(url: string, params: any = null) {
          return getMock(url, params)
        }
        post(url: string, data: any, params: any = null) {
          return postMock(url, data, params)
        }
        delete(url: string, data: any = null, params: any = null) {
          return deleteMock(url, data, params)
        }
      }
      return { default: BaseApi }
    })

    const LikeApi = (await import('../../api/like.api')).default
    const api = new LikeApi()

    api.store('p1')
    expect(postMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/likes'), {}, { lang: 'en' })

    api.destroy('p1')
    expect(deleteMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/likes'), { lang: 'en' }, null)

    api.getLikesOfPost('p1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/likes'), { lang: 'en' })

    api.checkIfLiked('p1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/likes/me'), { lang: 'en' })
  })
})


