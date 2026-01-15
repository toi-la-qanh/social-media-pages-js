import { describe, expect, it, vi } from 'vitest'

describe('FollowApi', () => {
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

    const FollowApi = (await import('../../api/follow.api')).default
    const api = new FollowApi()

    api.store('u1')
    expect(postMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/u1/follow'), {}, { lang: 'en' })

    api.destroy('u1')
    expect(deleteMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/u1/follow'), { lang: 'en' }, null)

    api.checkIfFollowing('u1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/u1/follow/me'), { lang: 'en' })

    api.getFollowers('u1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/u1/followers'), { lang: 'en' })

    api.getFollowing('u1')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/u1/following'), { lang: 'en' })
  })
})


