import { describe, expect, it, vi } from 'vitest'

describe('translation.ts (vue-i18n)', () => {
  it('uses sessionStorage language if set', async () => {
    sessionStorage.setItem('language', 'vi')
    vi.resetModules()

    const i18n = (await import('../../translation')).default
    expect(i18n.global.locale.value).toBe('vi')
  })

  it('defaults to "en" if sessionStorage language is empty', async () => {
    sessionStorage.removeItem('language')
    vi.resetModules()

    const i18n = (await import('../../translation')).default
    expect(i18n.global.locale.value).toBe('en')
  })
})


