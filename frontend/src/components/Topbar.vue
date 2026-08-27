<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const handleLogout = () => {
  const confirm = window.confirm("Apakah anda yakin ingin logout?");
  if (confirm) {
    localStorage.removeItem("token");
    router.replace({
      name: "login",
    });
  }
};
</script>

<template>
  <nav
    class="sticky top-0 z-50 border-b-2 border-black bg-white px-6 py-3 flex justify-between items-center shadow-sm"
  >
    <h1 class="text-xl font-bold tracking-tight">Kanggo.</h1>
    <button
      @click="handleLogout"
      class="bg-white border-2 border-black px-4 py-1.5 text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none cursor-pointer transition-all"
    >
      Logout
    </button>
  </nav>
</template>
