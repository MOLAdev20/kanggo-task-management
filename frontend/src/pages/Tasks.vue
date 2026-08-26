<script setup lang="ts">
import Axios from "axios";
import { ref, computed, onMounted } from "vue";
import axios from "../utilities/axios";

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
}
const tasks = ref<Task[]>([]);

const seletedTaskId = ref<number>();
const inputTitle = ref<string>("");
const inputDescription = ref<string>("");
const inputDeadline = ref<string>("");
const inputStatus = ref<"PENDING" | "IN_PROGRESS" | "DONE">("PENDING");

// Filter & Search Logic
const searchQuery = ref("");
const statusFilter = ref("ALL");

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchStatus =
      statusFilter.value === "ALL" || task.status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});

onMounted(() => {});

// Modal & Form State Management
const isModalOpen = ref(false);
const isEditing = ref(false);

const openModal = (task: null | Task = null) => {
  if (task) {
    isEditing.value = true;

    seletedTaskId.value = task.id;
    inputTitle.value = task.title;
    inputDescription.value = task.description;
    inputStatus.value = task.status;
    inputDeadline.value = task.deadline;

    console.log(task);
  } else {
    isEditing.value = false;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const saveTask = () => {
  if (isEditing.value) {
    // Logic Update
    const index = tasks.value.findIndex((t) => t.id === seletedTaskId.value);
    console.log(index);
  } else {
    // Logic Create
    console.log("Task dibuat");
  }
  closeModal();
};

const deleteTask = (id: number) => {
  console.log(id);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-black font-sans pb-20">
    <!-- Topbar -->
    <nav
      class="border-b-2 border-black bg-white px-6 py-3 flex justify-between items-center shadow-sm"
    >
      <h1 class="text-xl font-bold tracking-tight">Kerjaanmu.</h1>
      <button
        class="bg-white border-2 border-black px-4 py-1.5 text-sm font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
      >
        Logout
      </button>
    </nav>

    <main class="max-w-3xl mx-auto p-6">
      <!-- Header & Filters -->
      <div
        class="mb-6 flex flex-col md:flex-row justify-between items-end gap-4 border-b-2 border-black pb-4"
      >
        <div>
          <h2 class="text-2xl font-extrabold mb-1">Daftar Tugas</h2>
          <p class="text-sm text-gray-600">Fokus selesaikan satu-satu.</p>
        </div>

        <div class="flex flex-row gap-2 w-full md:w-auto">
          <!-- Search Filter Minimalis -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari tugas..."
            class="border-2 border-black px-3 py-1.5 text-sm w-full md:w-48 focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-colors"
          />

          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            class="border-2 border-black px-3 py-1.5 text-sm font-bold bg-white focus:outline-none cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors"
          >
            <option value="ALL">Semua</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
      </div>

      <!-- Stacking List Todo -->
      <div class="flex flex-col gap-3">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="group relative bg-white border-2 border-black p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform hover:-translate-y-0.5"
          :class="{
            'bg-[#FFD000]': task.status === 'IN_PROGRESS',
            'bg-gray-200 opacity-70': task.status === 'DONE',
          }"
        >
          <!-- Info Tugas Kiri -->
          <div class="flex-1 w-full">
            <div class="flex items-center gap-2 mb-1.5">
              <span
                class="border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase bg-white"
              >
                {{ task.status }}
              </span>
              <h3
                class="text-base font-bold leading-none truncate pr-10 sm:pr-0"
              >
                {{ task.title }}
              </h3>
            </div>
            <p class="text-sm text-gray-700 line-clamp-2">
              {{ task.description }}
            </p>
          </div>

          <!-- Deadline & Actions Kanan -->
          <div
            class="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 border-t-2 sm:border-t-0 border-black sm:border-transparent pt-3 sm:pt-0"
          >
            <span
              class="text-xs font-bold bg-gray-100 px-2 py-1 border-2 border-black mb-0 sm:mb-2 whitespace-nowrap"
            >
              Batas: {{ task.deadline }}
            </span>

            <!-- Hover Actions -->
            <div
              class="hidden sm:group-hover:flex gap-1.5 absolute right-4 top-4 sm:static"
            >
              <button
                @click="openModal(task)"
                class="bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all flex items-center justify-center h-8 w-8"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="square"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button
                @click="deleteTask(task.id)"
                class="bg-red-500 text-white border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all flex items-center justify-center h-8 w-8"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="square"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredTasks.length === 0"
          class="text-center py-10 font-bold border-2 border-black border-dashed text-gray-500 text-sm"
        >
          Belum ada data tugas nih.
        </div>
      </div>

      <!-- Pagination Minimalis -->
      <div
        class="mt-8 flex justify-center items-center gap-2 text-sm font-bold"
      >
        <button
          class="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
        >
          &lt;
        </button>
        <span
          class="px-3 py-1 bg-[#FFD000] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >1</span
        >
        <button
          class="bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
        >
          2
        </button>
        <button
          class="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
        >
          &gt;
        </button>
      </div>
    </main>

    <!-- Floating Action Button (FAB) -->
    <button
      @click="openModal()"
      class="fixed bottom-8 right-8 w-12 h-12 bg-[#FFD000] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all rounded-full z-40"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="square"
          stroke-width="3"
          d="M12 4v16m8-8H4"
        ></path>
      </svg>
    </button>

    <!-- Modal Form (Add / Edit) -->
    <Transition name="modal-anim">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm px-4"
      >
        <div
          class="bg-white border-2 border-black w-full max-w-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 relative"
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 font-bold text-2xl hover:text-red-500 leading-none"
          >
            &times;
          </button>
          <h2 class="text-xl font-extrabold mb-5">
            {{ isEditing ? "Edit Tugas" : "Tambah Tugas" }}
          </h2>

          <div @submit.prevent="saveTask" class="space-y-4 text-sm">
            <div>
              <label class="block font-bold mb-1 text-xs">Judul</label>
              <input
                v-model="inputTitle"
                required
                type="text"
                placeholder="Mau ngerjain apa?"
                class="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-yellow-50 transition-colors"
              />
            </div>

            <div>
              <label class="block font-bold mb-1 text-xs">Deskripsi</label>
              <textarea
                v-model="inputDescription"
                required
                rows="3"
                placeholder="Detail singkat aja..."
                class="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-yellow-50 transition-colors"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold mb-1 text-xs">Deadline</label>
                <input
                  v-model="inputDeadline"
                  required
                  type="date"
                  class="w-full border-2 border-black px-3 py-2 focus:outline-none focus:bg-yellow-50 font-bold transition-colors"
                />
              </div>
              <div>
                <label class="block font-bold mb-1 text-xs">Status</label>
                <select
                  v-model="inputStatus"
                  class="w-full border-2 border-black px-3 py-2 font-bold bg-white focus:outline-none cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
            </div>

            <div class="pt-2 flex gap-2">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-white border-2 border-black py-2 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                class="flex-1 bg-[#FFD000] border-2 border-black py-2 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* CSS buat animasi modal pop-up halus dari Vue Transition */
.modal-anim-enter-active,
.modal-anim-leave-active {
  transition: opacity 0.3s ease;
}
.modal-anim-enter-active > div,
.modal-anim-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-anim-enter-from,
.modal-anim-leave-to {
  opacity: 0;
}
.modal-anim-enter-from > div,
.modal-anim-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>
