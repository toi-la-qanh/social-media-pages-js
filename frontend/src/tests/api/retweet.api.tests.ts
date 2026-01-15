import { describe, expect, it, vi } from 'vitest'

describe('RetweetApi', () => {
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

    const RetweetApi = (await import('../../api/retweet.api')).default
    const api = new RetweetApi()

    api.store('p1')
    expect(postMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/retweets'), {}, { lang: 'en' })

    api.destroy('p1')
    expect(deleteMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/retweets'), { lang: 'en' }, null)

    api.getCountOfRetweets('p1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/posts/p1/retweets/count'), { lang: 'en' })

    api.getRetweetPostsOfUser('u1')
    expect(getMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/posts/users/u1/retweets?current_page=1&total_pages=10'),
      { lang: 'en' },
    )

    api.getRetweetPostsOfUser('u1', 2, 20)
    expect(getMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/posts/users/u1/retweets?current_page=2&total_pages=20'),
      { lang: 'en' },
    )
  })
})


