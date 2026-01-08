<template>
    <div :class="[
        'min-h-screen',
        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'
    ]">
        <SideBar />
        <div class="w-full flex justify-center h-full pb-20 lg:pb-5">
            <router-view />
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import SideBar from '../components/SideBar.vue'
import Footer from '../components/Footer.vue'
import { theme } from '../store.ts'
</script>