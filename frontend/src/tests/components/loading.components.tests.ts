import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Loading from '../../components/Loading.vue'

export class LoadingComponentTests {
  static register() {
    it('Loading.vue renders translated loading text', () => {
      const wrapper = mount(Loading, {
        props: { loading: true },
      })

      expect(wrapper.text()).toContain('Loading...')
    })

    it('Loading.vue hides spinner when loading=false', () => {
      const wrapper = mount(Loading, {
        props: { loading: false },
      })

      const spinner = wrapper.get('.lds-ellipsis')
      expect(spinner.attributes('style') ?? '').toContain('display: none')
    })
  }
}
