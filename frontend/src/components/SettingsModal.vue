<template>
    <!-- Overlay -->
    <div class="fixed inset-0 z-40" @click.self="closeModal">
        <!-- Main / Sub menus (single responsive layout) -->
        <div v-if="activeMenu === 'main'" :class="menuClass">
            <button @click="openMenu('appearance')" :class="menuItemClass">
                <span>{{ $t('settings.appearance') }}</span>
                <font-awesome-icon :icon="faAngleRight" />
            </button>
            <button @click="openMenu('language')" :class="menuItemClass">
                <span>{{ $t('settings.language') }}</span>
                <font-awesome-icon :icon="faAngleRight" />
            </button>
            <button :class="menuItemClass">
                <span>{{ $t('settings.settings') }}</span>
            </button>
            <button @click="handleLogout" :class="[menuItemClass, 'text-red-500']">
                <span>{{ $t('settings.logout') }}</span>
            </button>
        </div>

        <!-- Appearance submenu -->
        <div v-else-if="activeMenu === 'appearance'" :class="menuClass">
            <button @click="openMenu('main')" :class="[menuItemClass, 'flex items-center gap-2 justify-start']">
                <font-awesome-icon :icon="faArrowLeft" />
                <span>{{ $t('settings.back') }}</span>
            </button>
            <div class="flex justify-between items-center gap-2">
                <button @click="changeTheme('light')"
                    :class="[submenuButtonClass, theme === 'light' ? selectedSubmenuButtonClass : '']">
                    <font-awesome-icon :icon="faSun" />
                </button>
                <button @click="changeTheme('dark')"
                    :class="[submenuButtonClass, theme === 'dark' ? selectedSubmenuButtonClass : '']">
                    <font-awesome-icon :icon="faMoon" />
                </button>
                <button @click="changeTheme('auto')"
                    :class="[submenuButtonClass, theme === 'auto' ? selectedSubmenuButtonClass : '']">
                    {{ $t('settings.themes.auto') }}
                </button>
            </div>
        </div>

        <!-- Language submenu -->
        <div v-else-if="activeMenu === 'language'" :class="menuClass">
            <button @click="openMenu('main')" :class="[menuItemClass, 'flex items-center gap-2 justify-start']">
                <font-awesome-icon :icon="faArrowLeft" />
                <span>{{ $t('settings.back') }}</span>
            </button>
            <div class="flex flex-col gap-2">
                <button @click="changeLanguage('en')"
                    :class="[menuItemClass, language === 'en' ? selectedMenuItemClass : '']">
                    {{ $t('settings.languages.english') }}
                </button>
                <button @click="changeLanguage('vi')"
                    :class="[menuItemClass, language === 'vi' ? selectedMenuItemClass : '']">
                    {{ $t('settings.languages.vietnamese') }}
                </button>
                <button @click="changeLanguage('ja')"
                    :class="[menuItemClass, language === 'ja' ? selectedMenuItemClass : '']">
                    {{ $t('settings.languages.japanese') }}
                </button>
            </div>
        </div>
    </div>

</template>
<script lang="ts">
import { theme, showSettingsModal, language } from '../store.ts';
import UserApi from '../api/user.api';
import i18n from '../translation';
import { faAngleRight, faArrowLeft, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
    name: 'SettingsModal',
    components: {
        FontAwesomeIcon
    },
    setup() {
        return {
            theme,
            language,
            faAngleRight,
            faArrowLeft,
            faSun,
            faMoon,
        }
    },
    data() {
        return {
            activeMenu: 'main' as 'main' | 'appearance' | 'language',
        }
    },
    methods: {
        openMenu(menu: 'main' | 'appearance' | 'language') {
            this.activeMenu = menu;
        },
        closeModal() {
            this.activeMenu = 'main';
            showSettingsModal.value = false;
        },
        async handleLogout() {
            const userAPI = new UserApi();
            try {
                const response = await userAPI.logout();
                if (response.errors) {
                    console.error('Error logging out:', response.errors);
                    return;
                }
                this.closeModal();
                this.$router.push('/');
                window.location.reload();
            } catch (error) {
                console.error('Error logging out:', error);
            }
        },
        menuThemeClass() {
            return this.theme === 'dark'
                ? 'bg-stone-900 border-stone-700 text-white'
                : 'bg-white border-stone-300';
        },
        changeTheme(theme: string) {
            switch (theme) {
                case 'light':
                case 'dark':
                case 'auto':
                    this.theme = theme;
                    break;
                default:
                    this.theme = 'light';
            }
            localStorage.setItem('theme', this.theme);
        },
        changeLanguage(next: 'en' | 'vi' | 'ja') {
            this.language = next;
            sessionStorage.setItem('language', next);
            i18n.global.locale.value = next;
            window.location.reload();
        },
    },
    computed: {
        menuClass(): string[] {
            return [
                'flex flex-col gap-2 font-bold justify-start fixed z-50 px-3 py-4 min-w-60 border rounded-xl',
                // responsive positioning (small: top-right, lg: bottom-left)
                'top-15 right-3 lg:top-auto lg:right-auto lg:bottom-30 lg:left-4',
                ...this.menuThemeClass().split(' '),
            ];
        },
        menuItemClass(): string[] {
            return [
                'p-2 rounded-lg text-left flex justify-between items-center',
                this.theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200',
            ];
        },
        selectedMenuItemClass(): string {
            return this.theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200';
        },
        submenuButtonClass(): string[] {
            return [
                'flex-1 p-2 w-25 rounded-lg flex justify-center items-center',
                this.theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200',
            ];
        },
        selectedSubmenuButtonClass(): string {
            return this.theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200';
        },
    },
}
</script>