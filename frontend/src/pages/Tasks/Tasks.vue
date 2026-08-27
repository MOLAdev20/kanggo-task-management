<script setup lang="ts">
import { onMounted, ref } from "vue";
import Topbar from "../../components/Topbar.vue";
import TaskCard from "./components/TaskCard.vue";

// composables
import { useTopbarLayout } from "./composables/useTopbar";
import { useTasks } from "./composables/useTask";
import { useTaskModal } from "./composables/useTaskModal";
import ModalForm from "./components/ModalForm.vue";
import { Plus } from "@lucide/vue";

onMounted(() => {
  document.title = "Tugas Saya | Kanggo Task Management";
});

const topbarEl = ref<InstanceType<typeof Topbar> | null>(null);
const { topbarHeight } = useTopbarLayout(topbarEl);

const loadMoreTrigger = ref<HTMLElement | null>(null);
const {
  tasks,
  isLoadingTasks,
  hasLoadedTasks,
  hasMoreTasks,
  searchQuery,
  statusFilter,
  deleteTask,
} = useTasks(loadMoreTrigger);

const {
  isModalOpen,
  isEditing,
  inputTitle,
  inputDescription,
  inputDeadline,
  inputStatus,
  errorMessage,
  openModal,
  closeModal,
  saveTask,
} = useTaskModal(tasks);
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-black font-sans pb-20">
    <!-- Topbar -->
    <Topbar ref="topbarEl" />

    <main class="max-w-3xl mx-auto p-6 relative bg-amber-50">
      <!-- Header & Filters -->
      <div
        :style="{ top: topbarHeight + 'px' }"
        class="sticky z-40 mb-6 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b-2 border-black bg-amber-50 pb-4 pt-4 -mx-6 px-6 md:pt-0"
      >
        <div>
          <h2 class="text-2xl font-extrabold mb-1">Tugas Saya</h2>
          <p class="text-sm text-gray-600">Kelola semua tugas</p>
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
            <option value="all">Semua</option>
            <option value="pending">PENDING</option>
            <option value="in-progress">IN PROGRESS</option>
            <option value="done">DONE</option>
          </select>
        </div>
      </div>

      <!-- Stacking List Todo -->
      <div class="flex flex-col gap-3">
        <TaskCard
          :tasks="tasks"
          @open-modal="openModal"
          @delete-task="deleteTask"
        />

        <!-- Empty State & Loading -->
        <div
          v-if="hasLoadedTasks && tasks.length === 0"
          class="text-center py-10 font-bold border-2 border-black border-dashed text-gray-500 text-sm"
        >
          Belum ada data tugas
        </div>
        <div
          v-if="isLoadingTasks"
          class="py-4 text-center text-sm font-bold text-gray-500"
        >
          Memuat tugas...
        </div>
        <div
          v-else-if="hasLoadedTasks && !hasMoreTasks && tasks.length > 0"
          class="py-4 text-center text-sm text-gray-500"
        >
          Semua tugas sudah ditampilkan.
        </div>
        <div ref="loadMoreTrigger" class="h-px" aria-hidden="true"></div>
      </div>

      <!-- Floating Action Button (FAB) -->
      <button
        @click="openModal()"
        class="fixed bottom-8 right-8 p-2 bg-[#FFD000] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all rounded-full cursor-pointer z-40"
      >
        <Plus /> Tambah Tugas
      </button>
    </main>

    <!-- Modal Form (Add / Edit) -->
    <ModalForm
      :is-modal-open="isModalOpen"
      :is-editing="isEditing"
      :input-title="inputTitle"
      :input-description="inputDescription"
      :input-deadline="inputDeadline"
      :input-status="inputStatus"
      :error-message="errorMessage"
      @update:input-title="inputTitle = $event"
      @update:input-description="inputDescription = $event"
      @update:input-deadline="inputDeadline = $event"
      @update:input-status="inputStatus = $event"
      @close="closeModal"
      @save="saveTask"
    />
  </div>
</template>
