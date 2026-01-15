<template>
    <div
        class="h-auto shadow-gray-200 shadow-sm lg:w-1/2 md:w-2/3 md:mb-0 m-4 w-full rounded-3xl border-gray-300 border-2 px-6 py-3">
        <div class="flex transition-colors duration-700 my-10 w-full flex-col justify-center items-center">
            <!-- Title -->
            <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-1">
                <h2 class="text-center text-2xl font-bold">
                    {{ $t('forgotPassword.title') }}
                </h2>
                <h3 class="text-center italic text-sm text-gray-500">
                    {{ $t('forgotPassword.subtitle') }}
                </h3>
            </div>

            <!-- Form -->
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" @submit.prevent="validateFormInput">
                    <!-- Email -->
                    <div className="flex gap-4 items-center">
                        <FontAwesomeIcon class="sm:text-3xl text-2xl" :icon="faEnvelope" />
                        <input v-model="email" name="email" type="email" autoComplete="on" :placeholder="$t('forgotPassword.input.email')"
                            class="block w-full rounded-md border-0 sm:py-3 py-2 sm:px-3 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" />
                    </div>

                    <!-- Sign In Button -->
                    <div>
                        <button type="submit" :disabled="isCountdownActive"
                            :class="[
                                'flex w-full justify-center items-center mb-2 rounded-md h-9 text-base font-semibold shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                                isCountdownActive 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-700'
                            ]">
                            {{ $t('forgotPassword.buttons.sendResetLink') }}
                        </button>
                    </div>

                    <!-- Login Errors -->
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
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import UserApi from '../api/user.api';

export default {
    components: {
        FontAwesomeIcon,
    },
    setup() {
        return {
            faEnvelope,
            faLock,
        }
    },
    name: 'ForgotPassword',
    data() {
        return {
            email: '',
            message: null,
            errors: null,
            countdown: 0,
            countdownTimer: null as ReturnType<typeof setInterval> | null,
        }
    },
    computed: {
        isCountdownActive() {
            return this.countdown > 0;
        },
        buttonText() {
            if (this.countdown > 0) {
                return `${this.$t('forgotPassword.buttons.resendIn')} ${this.countdown}s`;
            }
            if (this.message) {
                return this.$t('forgotPassword.buttons.resendResetLink');
            }
            return this.$t('forgotPassword.buttons.sendResetLink');
        },
    },
    beforeUnmount() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
        }
    },
    methods: {
        navigate(path: string) {
            this.$router.push(path);
        },
        startCountdown() {
            this.countdown = 10;
            if (this.countdownTimer) {
                clearInterval(this.countdownTimer);
            }
            this.countdownTimer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    if (this.countdownTimer) {
                        clearInterval(this.countdownTimer);
                        this.countdownTimer = null;
                    }
                }
            }, 1000);
        },
        async validateFormInput() {
            const userApi = new UserApi();
            try {
                const response = await userApi.forgotPassword({ email: this.email });
                if (response.errors) {
                    this.errors = response.errors;
                    return;
                }
                this.message = response.message;
                this.errors = null;
                this.startCountdown();
            } catch (error) {
                console.error('Error sending reset link:', error);
            }
        },
    },
}
</script>