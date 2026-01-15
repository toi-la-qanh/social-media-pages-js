import { config } from '@vue/test-utils'
import { afterEach, beforeEach, vi } from 'vitest'
import en from '../locales/en.json'

// Provide minimal global mocks that many components rely on.
// You can expand this as your test suite grows (router, i18n, etc).
config.global.mocks = {
  $t: (key: string) => {
    const parts = key.split('.')
    let cur: any = en
    for (const p of parts) {
      cur = cur?.[p]
    }
    return typeof cur === 'string' ? cur : key
  },
}

beforeEach(() => {
  sessionStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})


