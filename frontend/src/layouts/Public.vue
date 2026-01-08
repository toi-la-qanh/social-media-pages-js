<template>
    <div :class="[
        'min-h-screen duration-300 h-full',
        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100/50 text-black'
    ]">
        <!-- Show SideBar for authenticated users -->
        <div v-if="user && user.id !== null">
            <SideBar />
            <Footer />
        </div>
        <!-- Show NavBar and Footer for guest users -->
        <div v-else>
            <NavBar />
            <Footer />
        </div>

        <div class="w-full flex justify-center h-full pb-20 lg:pb-5">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import SideBar from '../components/SideBar.vue'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import { theme, user } from '../store.ts'

export default {
    name: 'Public',
    components: {
        SideBar,
        NavBar,
        Footer,
    },
    data() {
        return {
            theme,
            user,
        }
    },
}


</script>