import { describe } from 'vitest'

import { AuthLayoutTests } from './auth.layouts.tests'
import { GuestLayoutTests } from './guest.layouts.tests'
import { PublicLayoutTests } from './public.layouts.tests'

describe('Layouts', () => {
  AuthLayoutTests.register()
  GuestLayoutTests.register()
  PublicLayoutTests.register()
})


