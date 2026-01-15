import { vi } from 'vitest'

export function makeRouterMocks() {
  return {
    $route: { path: '/', name: 'Home', params: {} as Record<string, any> },
    $router: { push: vi.fn(), back: vi.fn(), go: vi.fn() },
  }
}


