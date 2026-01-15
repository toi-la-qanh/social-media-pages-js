import { vi } from 'vitest'

export const makeSocket = () => ({
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
})

export const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))


