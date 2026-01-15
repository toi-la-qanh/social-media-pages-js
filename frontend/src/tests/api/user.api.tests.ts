import { describe, expect, it, vi } from 'vitest'

describe('UserApi', () => {
  it('builds correct endpoints and passes { lang } params', async () => {
    sessionStorage.setItem('language', 'en')
    vi.resetModules()

    const getMock = vi.fn()
    const postMock = vi.fn()
    const patchMock = vi.fn()

    vi.doMock('../../api/base.api', () => {
      class BaseApi {
        get(url: string, params?: any) {
          return getMock(url, params)
        }
        post(url: string, data?: any, params?: any) {
          return postMock(url, data, params)
        }
        patch(url: string, data?: any, params?: any) {
          return patchMock(url, data, params)
        }
      }
      return { default: BaseApi }
    })

    const UserApi = (await import('../../api/user.api')).default
    const api = new UserApi()

    api.getUser()
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/me'), { lang: 'en' })

    api.getThisUser('alice')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/profile/alice'), { lang: 'en' })

    await api.login({ email: 'a@b.com', password: 'pw' })
    expect(postMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/signin'),
      { email: 'a@b.com', password: 'pw' },
      { lang: 'en' },
    )

    await api.register({ email: 'a@b.com', password: 'pw', username: 'u', full_name: 'U' })
    expect(postMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/signup'),
      { email: 'a@b.com', password: 'pw', username: 'u', full_name: 'U' },
      { lang: 'en' },
    )

    await api.logout()
    expect(postMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/logout'), {}, { lang: 'en' })

    await api.forgotPassword({ email: 'a@b.com' })
    expect(postMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/forgot-password'), { email: 'a@b.com' }, { lang: 'en' })

    await api.updatePassword('token123', { password: 'pw', password_confirm: 'pw' })
    expect(patchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/update-password/token123'),
      { password: 'pw', password_confirm: 'pw' },
      { lang: 'en' },
    )

    await api.search('john')
    expect(getMock).toHaveBeenCalledWith(expect.stringContaining('/api/users/search'), { q: 'john', lang: 'en' })
  })
})


