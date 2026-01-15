import { describe, expect, it, vi } from 'vitest'

describe('store.ts', () => {
  it('defaults language to "en" when sessionStorage has no language', async () => {
    sessionStorage.removeItem('language')
    vi.resetModules()

    const store = await import('../../store')
    expect(store.language.value).toBe('en')
  })

  it('reads language from sessionStorage when present', async () => {
    sessionStorage.setItem('language', 'en')
    vi.resetModules()

    const store = await import('../../store')
    expect(store.language.value).toBe('en')
  })

  it('exports expected default ref values', async () => {
    vi.resetModules()
    const store = await import('../../store')

    expect(store.theme.value).toBe('light')
    expect(store.isLoading.value).toBe(false)
    expect(store.showCreatePostModal.value).toBe(false)
    expect(store.showCreateReplyModal.value).toBe(false)
    expect(store.showSettingsModal.value).toBe(false)
    expect(store.user.value).toEqual({
      username: null,
      full_name: null,
      id: null,
      image_url: null,
    })
  })
})


