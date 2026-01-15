import { describe } from 'vitest'

import { CreatePostModalComponentTests } from './create-post-modal.components.tests'
import { CreateReplyModalComponentTests } from './create-reply-modal.components.tests'
import { FooterComponentTests } from './footer.components.tests'
import { LoadingComponentTests } from './loading.components.tests'
import { NavBarComponentTests } from './nav-bar.components.tests'
import { SettingsModalComponentTests } from './settings-modal.components.tests'
import { SideBarComponentTests } from './side-bar.components.tests'

describe('Components', () => {
  LoadingComponentTests.register()
  FooterComponentTests.register()
  NavBarComponentTests.register()
  SideBarComponentTests.register()
  SettingsModalComponentTests.register()
  CreatePostModalComponentTests.register()
  CreateReplyModalComponentTests.register()
})
