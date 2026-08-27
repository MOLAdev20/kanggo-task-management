<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "../utilities/axios";
import { useRouter } from "vue-router";

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");

onMounted(() => {
  document.title = "Daftar Akun | Kanggo Task Management";
});

const router = useRouter();
const handleRegister = () => {
  if (name.value === "" || email.value === "" || password.value === "") {
    errorMessage.value = "Semua field harus diisi!";
    return;
  }

  axios.post(
    "auth/register",
    {
      name: name.value,
      email: email.value,
      password: password.value,
    },
    ({ token }: any) => {
      localStorage.setItem("token", token);
      router.replace({
        name: "task",
      });
    },
    (err: any) => {
      if (err.response.status === 409) {
        errorMessage.value = "Email tersebut sudah terdaftar";
      } else {
        errorMessage.value = "Terjadi kesalahan, coba refresh dulu";
      }
    },
  );
};
</script>
<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-8">
    <div
      class="w-full max-w-4xl border-[3px] border-(--ink) hard-shadow bg-white grid grid-cols-1 md:grid-cols-2"
    >
      <!-- Panel kiri: kuning, teks pendukung -->
      <section
        class="bg-(--yellow) border-b-[3px] md:border-b-0 md:border-r-[3px] border-(--ink) p-8 sm:p-10 flex flex-col justify-between min-h-55 md:min-h-130"
      >
        <div>
          <span
            class="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase bg-(--ink) text-(--yellow) px-2.5 py-1"
          >
            Daftar Akun
          </span>
          <div
            class="font-display font-bold text-(--ink) text-3xl sm:text-4xl leading-[1.1] mt-6"
          >
            <img
              src="https://www.kanggo.id/images/kanggo-logo-new-red.png"
              width="100%"
            />
          </div>
        </div>
      </section>

      <!-- Panel kanan: form login -->
      <section class="bg-white p-8 sm:p-10 flex flex-col justify-center">
        <h2 class="font-display font-bold text-2xl text-(--ink)">
          Daftar Akun
        </h2>
        <p class="text-sm text-(--ink)/60 mt-1.5 mb-7">
          Buat akun untuk mulai beraktivitas
        </p>

        <div class="space-y-5">
          <div>
            <label
              for="name"
              class="block text-[13px] font-semibold text-(--ink) mb-1.5"
            >
              Nama Lengkap
            </label>
            <input
              v-model="name"
              id="name"
              type="text"
              placeholder="Nama Lengkap"
              class="w-full border-[3px] border-(--ink) px-3.5 py-2.5 text-[15px] placeholder:text-(--ink)/35 focus:outline-none"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-[13px] font-semibold text-(--ink) mb-1.5"
            >
              Email
            </label>
            <input
              v-model="email"
              id="email"
              type="email"
              placeholder="mail@example.com"
              class="w-full border-[3px] border-(--ink) px-3.5 py-2.5 text-[15px] placeholder:text-(--ink)/35 focus:outline-none"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label
                for="password"
                class="block text-[13px] font-semibold text-(--ink)"
              >
                Password
              </label>
            </div>
            <input
              v-model="password"
              id="password"
              type="password"
              class="w-full border-[3px] border-(--ink) px-3.5 py-2.5 text-[15px] placeholder:text-(--ink)/35 focus:outline-none"
            />
          </div>

          <div>
            <p
              v-if="errorMessage != ''"
              class="text-red-500 text-sm font-semibold"
            >
              {{ errorMessage }}
            </p>
            <button
              @click="handleRegister"
              class="btn-press w-full bg-(--yellow) border-[3px] border-(--ink) hard-shadow-sm text-(--ink) font-display font-bold text-[15px] py-2.5 mt-2"
            >
              Daftar
            </button>
          </div>
        </div>

        <p class="text-[14px] text-(--ink)/70 mt-7">
          Sudah punya akun?
          <RouterLink
            :to="{ name: 'login' }"
            class="font-semibold text-(--ink) underline decoration-2 decoration-(--yellow) underline-offset-2 hover:decoration-(--blue)"
          >
            Login di sini
          </RouterLink>
        </p>
      </section>
    </div>
  </div>
</template>
<style>
:root {
  --ink: #111113;
  --yellow: #ffcc00;
  --blue: #2d6cdf;
  --paper: #f4f5f7;
}
* {
  border-radius: 0 !important;
}
body {
  background-color: var(--paper);
  font-family: "Inter", sans-serif;
}
.font-display {
  font-family: "Space Grotesk", sans-serif;
}
.hard-shadow {
  box-shadow: 8px 8px 0px 0px var(--ink);
}
.hard-shadow-sm {
  box-shadow: 4px 4px 0px 0px var(--ink);
}
.btn-press {
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}
.btn-press:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px var(--ink);
}
.btn-press:active {
  transform: translate(0, 0);
  box-shadow: 2px 2px 0px 0px var(--ink);
}
input:focus-visible,
a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--blue);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  .btn-press {
    transition: none;
  }
  .btn-press:hover {
    transform: none;
  }
}
</style>
