import { describe, expect, it, vi } from 'vitest'

describe('OthersApi', () => {
  it('returns a deep-copied list of emojis', async () => {
    vi.resetModules()

    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        results: [{ emoji: '😀' }, { emoji: '😎' }],
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const OthersApi = (await import('../../api/others.api')).default
    const emojis = await OthersApi.getEmojis()

    expect(fetchMock).toHaveBeenCalled()
    expect(emojis).toEqual(['😀', '😎'])
  })

  it('logs and rethrows on fetch error', async () => {
    vi.resetModules()

    const err = new Error('boom')
    const fetchMock = vi.fn().mockRejectedValue(err)
    vi.stubGlobal('fetch', fetchMock)

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const OthersApi = (await import('../../api/others.api')).default
    await expect(OthersApi.getEmojis()).rejects.toThrow('boom')
    expect(consoleError).toHaveBeenCalled()
  })
})


