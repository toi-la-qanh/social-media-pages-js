<template>
    <div
        class="h-auto shadow-gray-200 shadow-sm lg:w-1/2 md:w-2/3 md:mb-0 m-4 w-full rounded-3xl border-gray-300 border-2 px-6 py-3">
        <div class="flex transition-colors duration-700 my-10 w-full flex-col justify-center items-center">
            <!-- Title -->
            <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-1">
                <h2 class="text-center text-2xl font-bold">
                    {{ $t('resetPassword.title') }}
                </h2>
                <h3 class="text-center italic text-sm text-gray-500">
                    {{ $t('resetPassword.subtitle') }}
                </h3>
            </div>

            <!-- Form -->
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" @submit.prevent="validateFormInput">
                    <!-- Password -->
                    <div class="flex gap-4 items-center">
                        <FontAwesomeIcon class="sm:text-3xl text-2xl" :icon="faLock" />
                        <div
                            class="flex items-center sm:py-2.5 py-1.5 sm:px-3 px-2 w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                            <input v-model="password" name="password" :type="showPassword ? 'text' : 'password'"
                                :placeholder="$t('resetPassword.input.password')"
                                class="placeholder:text-gray-400 focus:ring-0 focus:outline-none w-full" />
                            <FontAwesomeIcon class="inline-block sm:text-2xl text-xl" :icon="faEye" v-if="showPassword"
                                @click="toggleShowPassword" />
                            <FontAwesomeIcon class="inline-block sm:text-2xl text-xl" :icon="faEyeSlash" v-else
                                @click="toggleShowPassword" />
                        </div>
                    </div>

                    <!-- Password Confirm -->
                    <div className="flex gap-4 items-center">
                        <FontAwesomeIcon class="sm:text-3xl text-2xl" :icon="faLock" />
                        <div
                            class="flex items-center sm:py-2.5 py-1.5 sm:px-3 px-2 w-full rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                            <input v-model="password_confirm" name="password_confirm"
                                :type="showPassword ? 'text' : 'password'" :placeholder="$t('resetPassword.input.password_confirm')"
                                class="placeholder:text-gray-400 focus:ring-0 focus:outline-none w-full" />
                            <FontAwesomeIcon class="inline-block sm:text-2xl text-xl" :icon="faEye" v-if="showPassword"
                                @click="toggleShowPassword" />
                            <FontAwesomeIcon class="inline-block sm:text-2xl text-xl" :icon="faEyeSlash" v-else
                                @click="toggleShowPassword" />
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div>
                        <button type="submit"
                            class="flex w-full justify-center items-center mb-2 rounded-md bg-gray-100 text-gray-900 h-9 text-base font-semibold shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            {{ $t('resetPassword.buttons.updatePassword') }}
                        </button>
                    </div>

                    <!-- Errors -->
                    <p v-if="errors" class="text-red-800">
                        {{ errors }}
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import UserApi from '../api/user.api';

export default {
    components: {
        FontAwesomeIcon,
    },
    setup() {
        return {
            faLock,
            faEye,
            faEyeSlash,
        }
    },
    name: 'ResetPassword',
    data() {
        return {
            password: '',
            password_confirm: '',
            message: null,
            errors: null,
            showPassword: false,
        }
    },
    methods: {
        navigate(path: string) {
            this.$router.push(path);
        },
        async validateFormInput() {
            const userApi = new UserApi();
            try {
                const response = await userApi.updatePassword(this.$route.params.token as string, { password: this.password, password_confirm: this.password_confirm });
                if (response.errors) {
                    this.errors = response.errors;
                    return;
                }
                this.message = response.message;
                this.errors = null;
                this.$router.push('/sign-in');
            } catch (error) {
                console.error('Error updating password:', error);;
            }
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
    },
}
</script>