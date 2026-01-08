<template>
    <!-- Overlay -->
    <div class="fixed inset-0 z-40" @click.self="closeModal">
        <!-- Main Settings Menu - For Large Screen -->
        <div v-if="!showChangeThemeModal" :class="['hidden lg:flex flex-col gap-2 font-bold justify-start fixed z-50 bottom-30 left-4 px-3 py-4 min-w-60 border rounded-xl',
            theme === 'dark' ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-300'
        ]">
            <button @click="openChangeTheme"
                :class="['p-2 rounded-lg text-left flex justify-between items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                Appearance
                <font-awesome-icon :icon="faAngleRight" />
            </button>
            <button :class="['p-2 rounded-lg text-left',
                theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                Settings
            </button>
            <button @click="handleLogout" :class="['text-red-500 p-2 rounded-lg text-left',
                theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200']">
                Logout
            </button>
        </div>

        <!-- Main Settings Menu - For Small Screen -->
        <div v-if="!showChangeThemeModal" :class="['lg:hidden flex flex-col gap-2 font-bold justify-start fixed z-50 top-15 right-3 px-3 py-4 min-w-60 border rounded-xl',
            theme === 'dark' ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-300'
        ]">
            <button @click="openChangeTheme"
                :class="['p-2 rounded-lg text-left flex justify-between items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                Appearance
                <font-awesome-icon :icon="faAngleRight" />
            </button>
            <button :class="['p-2 rounded-lg text-left',
                theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                Settings
            </button>
            <button @click="handleLogout" :class="['text-red-500 p-2 rounded-lg text-left',
                theme === 'dark' ? 'hover:bg-stone-700' : 'hover:bg-stone-200']">
                Logout
            </button>
        </div>

        <!-- Change Theme Modal - For Large Screen -->
        <div v-if="showChangeThemeModal" :class="['hidden lg:flex flex-col gap-2 font-bold justify-start fixed z-50 bottom-30 left-4 px-3 py-4 min-w-60 border rounded-xl',
            theme === 'dark' ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-300']">
            <button @click="closeChangeTheme"
                :class="['p-2 rounded-lg text-left flex items-center gap-2',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                <font-awesome-icon :icon="faArrowLeft" />
                <span>Back</span>
            </button>
            <div class="flex justify-between items-center gap-2">
                <button @click="changeTheme('light')" :class="['flex-1 p-2 rounded-lg flex justify-center items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                    <font-awesome-icon :icon="faSun" />
                </button>
                <button @click="changeTheme('dark')" :class="['flex-1 p-2 rounded-lg flex justify-center items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                    <font-awesome-icon :icon="faMoon" />
                </button>
                <button @click="changeTheme('auto')" :class="['flex-1 p-2 rounded-lg flex justify-center items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">Auto</button>
            </div>
        </div>

        <!-- Change Theme Modal - For Small Screen -->
        <div v-if="showChangeThemeModal" :class="['lg:hidden flex flex-col gap-2 font-bold justify-start fixed z-50 top-15 right-3 px-3 py-4 min-w-60 border rounded-xl',
            theme === 'dark' ? 'bg-stone-900 border-stone-700' : 'bg-white border-stone-300']">
            <button @click="closeChangeTheme"
                :class="['p-2 rounded-lg text-left flex items-center gap-2',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                <font-awesome-icon :icon="faArrowLeft" />
                <span>Back</span>
            </button>
            <div class="flex justify-between items-center gap-2">
                <button @click="changeTheme('light')" :class="['flex-1 p-2 rounded-lg flex justify-center items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                    <font-awesome-icon :icon="faSun" />
                </button>
                <button @click="changeTheme('dark')" :class="['flex-1 p-2 rounded-lg flex justify-center items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">
                    <font-awesome-icon :icon="faMoon" />
                </button>
                <button @click="changeTheme('auto')" :class="['flex-1 p-2 rounded-lg flex justify-center items-center',
                    theme === 'dark' ? 'text-white hover:bg-stone-700' : 'hover:bg-stone-200']">Auto</button>
            </div>
        </div>
    </div>

</template>
<script lang="ts">
import { theme, showSettingsModal } from '../store.ts';
import UserApi from '../api/user.api';
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
            faAngleRight,
            faArrowLeft,
            faSun,
            faMoon,
        }
    },
    data() {
        return {
            showChangeThemeModal: false,
        }
    },
    methods: {
        closeModal() {
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
        openChangeTheme() {
            this.showChangeThemeModal = true;
        },
        changeTheme(theme: string) {
            const newTheme = () => {
                switch (theme) {
                    case 'light':
                        return 'light';
                    case 'dark':
                        return 'dark';
                    case 'auto':
                        return 'light';
                    default:
                        return 'light';
                }
            };
            this.theme = newTheme();
            localStorage.setItem('theme', this.theme);
        },
        closeChangeTheme() {
            this.showChangeThemeModal = false;
        },
    },
}
</script>