<template>
    <div
        :class="[
            'h-auto lg:w-1/2 md:w-2/3 md:mb-0 m-4 w-full rounded-3xl border px-6 py-3',
            theme === 'dark' ? 'border-gray-800 bg-stone-900/80' : 'border-gray-300 bg-white shadow-gray-200 shadow-sm'
        ]">
        <div class="flex transition-colors duration-700 my-10 w-full flex-col justify-center items-center">
            <!-- Title -->
            <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-1">
                <h2 class="text-center text-2xl font-bold">
                    {{ $t('signIn.title') }}
                </h2>
                <h3 class="text-center italic text-sm text-gray-500">
                    {{ $t('signIn.subtitle') }}
                </h3>
            </div>

            <!-- Form -->
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form @submit.prevent="validateFormInput">
                    <!-- Email -->
                    <div className="flex gap-4 items-center pb-6">
                        <FontAwesomeIcon class="sm:text-xl text-base" :icon="faEnvelope" />
                        <input v-model="email" name="email" type="email" autoComplete="on" :placeholder="$t('signIn.input.email')"
                            class="block w-full rounded-md border-0 sm:py-3 py-2 sm:px-3 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm text-xs" />
                    </div>

                    <!-- Forgot Password -->
                    <div class="flex justify-end sm:text-sm text-xs">
                        <router-link to="/forgot-password" class="font-semibold text-sky-600 hover:text-sky-500">
                            {{ $t('signIn.buttons.forgotPassword') }}
                        </router-link>
                    </div>

                    <!-- Password -->
                    <div className="flex gap-4 items-center pb-6">
                        <FontAwesomeIcon class="sm:text-xl text-base" :icon="faLock" />
                        <div class="flex items-center sm:py-2.5 py-1.5 sm:px-3 px-2 w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm text-xs">
                            <input v-model="password" name="password" :type="showPassword ? 'text' : 'password'" :placeholder="$t('signIn.input.password')"
                                class="placeholder:text-gray-400 focus:ring-0 focus:outline-none w-full" />
                            <FontAwesomeIcon class="inline-block sm:text-xl text-base" :icon="faEye" v-if="showPassword" @click="toggleShowPassword" />
                            <FontAwesomeIcon class="inline-block sm:text-xl text-base" :icon="faEyeSlash" v-else @click="toggleShowPassword" />
                        </div>
                    </div>

                    <!-- Sign In Button -->
                    <div>
                        <button type="submit"
                            :class="[
                                'flex w-full h-auto p-2 justify-center rounded-md border',
                                theme === 'dark' ? 'bg-black hover:bg-stone-800 border-gray-700' : 'bg-black text-white hover:bg-stone-800 border-stone-200'
                            ]">
                            {{ $t('signIn.buttons.signIn') }}
                        </button>
                    </div>

                    <!-- Login Errors -->
                    <p v-if="errors" class="text-red-800">
                        {{ errors }}
                    </p>
                </form>

                <!-- Register Link -->
                <p class="flex py-2 justify-between sm:text-sm text-xs">
                    {{ $t('signIn.subtext.noAccount') }}
                    <router-link to="/sign-up" class="font-semibold text-sky-600 hover:text-sky-500">
                        {{ $t('signIn.buttons.signUpNow') }}
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import UserApi from '../api/user.api';
import { theme } from '../store.ts';
export default {
    components: {
        FontAwesomeIcon,
    },
    setup() {
        return {
            faEnvelope,
            faLock,
            faEye,
            faEyeSlash,
        }
    },
    name: 'SignIn',
    data() {
        return {
            email: '',
            password: '',
            errors: null,
            showPassword: false,
            theme,
        }
    },
    methods: {
        navigate(path: string) {
            this.$router.push(path);
        },
        async validateFormInput() {
            const userApi = new UserApi();
            try {
                const response = await userApi.login({ email: this.email, password: this.password });
                if (response.errors) {
                    this.errors = response.errors;
                    return;
                }
                this.$router.push('/');
            } catch (error) {
                console.error('Error logging in:', error);
            }
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
    },
}
</script>