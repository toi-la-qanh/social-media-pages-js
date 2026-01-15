import { describe, expect, it, vi } from 'vitest'

describe('BaseApi', () => {
  it('returns deep-copied response data on success', async () => {
    const axiosInstance = vi.fn().mockResolvedValue({
      data: { ok: true, nested: { a: 1 } },
    })
    ;(axiosInstance as any).defaults = {}

    vi.resetModules()
    vi.doMock('axios', () => {
      const axios = Object.assign(vi.fn(), {
        create: vi.fn(() => axiosInstance),
      })
      return { default: axios }
    })

    const BaseApi = (await import('../../api/base.api')).default
    const api = new BaseApi()

    const result = await api.get('/hello')
    expect(result).toEqual({ ok: true, nested: { a: 1 } })
    expect(axiosInstance).toHaveBeenCalledWith({
      method: 'get',
      url: '/hello',
      data: null,
      params: null,
    })
  })

  it('returns error.response.data when server responds with error', async () => {
    const axiosInstance = vi.fn().mockRejectedValue({
      response: { data: { errors: 'Bad Request' } },
    })
    ;(axiosInstance as any).defaults = {}

    vi.resetModules()
    vi.doMock('axios', () => {
      const axios = Object.assign(vi.fn(), {
        create: vi.fn(() => axiosInstance),
      })
      return { default: axios }
    })

    const BaseApi = (await import('../../api/base.api')).default
    const api = new BaseApi()

    const result = await api.get('/boom')
    expect(result).toEqual({ errors: 'Bad Request' })
  })

  it('returns network error when request was made but no response received', async () => {
    const axiosInstance = vi.fn().mockRejectedValue({
      request: {},
    })
    ;(axiosInstance as any).defaults = {}

    vi.resetModules()
    vi.doMock('axios', () => {
      const axios = Object.assign(vi.fn(), {
        create: vi.fn(() => axiosInstance),
      })
      return { default: axios }
    })

    const BaseApi = (await import('../../api/base.api')).default
    const api = new BaseApi()

    const result = await api.get('/nope')
    expect(result).toEqual({ errors: 'Network Error: No response from server' })
  })

  it('returns unknown error for other failures', async () => {
    const axiosInstance = vi.fn().mockRejectedValue(new Error('oops'))
    ;(axiosInstance as any).defaults = {}

    vi.resetModules()
    vi.doMock('axios', () => {
      const axios = Object.assign(vi.fn(), {
        create: vi.fn(() => axiosInstance),
      })
      return { default: axios }
    })

    const BaseApi = (await import('../../api/base.api')).default
    const api = new BaseApi()

    const result = await api.get('/unknown')
    expect(result).toEqual({ errors: 'Unknown Error: oops' })
  })
})


