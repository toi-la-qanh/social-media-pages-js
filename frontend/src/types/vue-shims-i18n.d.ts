import 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * vue-i18n global translation function (enabled via `globalInjection: true`)
     */
    $t: (key: string, ...args: unknown[]) => string
  }
}

export {}


