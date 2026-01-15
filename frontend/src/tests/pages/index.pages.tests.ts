import { describe } from 'vitest'

import { NotFoundPageTests } from './not-found.pages.tests'
import { SignInPageTests } from './sign-in.pages.tests'
import { SignUpPageTests } from './sign-up.pages.tests'
import { ForgotPasswordPageTests } from './forgot-password.pages.tests'
import { ResetPasswordPageTests } from './reset-password.pages.tests'
import { SearchPageTests } from './search.pages.tests'
import { NotificationPageTests } from './notification.pages.tests'
import { HomePageTests } from './home.pages.tests'
import { ProfilePageTests } from './profile.pages.tests'
import { SpecifiedPostPageTests } from './specified-post.pages.tests'

/**
 * Run Unit tests for all pages
 */
export class PagesTests {
  static register() {
    describe('Pages', () => {
      NotFoundPageTests.register()
      SignInPageTests.register()
      SignUpPageTests.register()
      ForgotPasswordPageTests.register()
      ResetPasswordPageTests.register()
      SearchPageTests.register()
      NotificationPageTests.register()
      HomePageTests.register()
      ProfilePageTests.register()
      SpecifiedPostPageTests.register()
    })    
  }
}
