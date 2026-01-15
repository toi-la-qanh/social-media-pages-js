import { describe, expect, it, vi } from 'vitest'

describe('NotificationApi', () => {
  it('builds correct endpoints', async () => {
    vi.resetModules()

    const getMock = vi.fn()
    const postMock = vi.fn()

    vi.doMock('../../api/base.api', () => {
      class BaseApi {
        get(url: string, params: any = null) {
          return getMock(url, params)
        }
        post(url: string, data: any, params: any = null) {
          return postMock(url, data, params)
        }
      }
      return { default: BaseApi }
    })

    const NotificationApi = (await import('../../api/notification.api')).default
    const api = new NotificationApi()

    api.index()
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/users'), null)

    api.create({ type: 'like', message: 'm', data: { id: 1 } })
    expect(postMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/users'),
      {
        type: 'like',
        message: 'm',
        data: { id: 1 },
      },
      null,
    )
  })
})


