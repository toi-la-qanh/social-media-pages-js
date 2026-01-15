// Single-entry test runner (like backend): Vitest only discovers this file,
// and this file imports all test suites.

import './components/loading.components.tests'
import './others/store.tests'
import './others/translation.tests'
import './api/base.api.tests'
import './api/user.api.tests'
import './api/follow.api.tests'
import './api/like.api.tests'
import './api/post.api.tests'
import './api/retweet.api.tests'
import './api/notification.api.tests'
import './api/others.api.tests'
import './layouts/index.layouts.tests'
import './components/index.components.tests'
import { PagesTests } from './pages/index.pages.tests'

PagesTests.register()