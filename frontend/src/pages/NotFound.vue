<template>
  <div class="w-full max-w-90 h-screen flex flex-col justify-center items-center text-center text-base gap-3">
    <h1 class="font-bold">{{ $t("notFound.title") }}</h1>
    <p>{{ $t("notFound.subtitle") }}</p>
    <button @click="goBack" :class="[
      'border rounded-lg py-1 px-4',
      theme === 'dark' ? 'bg-stone-900/80 border-stone-700 hover:border-stone-500' : 'border-stone-300 hover:border-stone-400'
    ]">
      {{ $t("notFound.buttons.goBack") }}
    </button>
  </div>
</template>

<script>
import { theme } from '../store.ts';
export default {
  name: "NotFound",
  data() {
    return {
      theme,
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>