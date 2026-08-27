<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import axios from "../utilities/axios";
import Topbar from "../components/Topbar.vue";

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
}
const tasks = ref<Task[]>([]);
const nextCursor = ref<number | null>(null);
const hasMoreTasks = ref(true);
const isLoadingTasks = ref(false);
const hasLoadedTasks = ref(false);
const loadMoreTrigger = ref<HTMLElement | null>(null);
let taskObserver: IntersectionObserver | undefined;
let filterTimeout: ReturnType<typeof setTimeout> | undefined;
let activeRequestId = 0;

// Refs & state buat sticky topbar + sticky filter section
const topbarEl = ref<InstanceType<typeof Topbar> | null>(null);
const topbarHeight = ref(0);
let topbarResizeObserver: ResizeObserver | undefined;

const updateTopbarHeight = () => {
  const el = topbarEl.value?.$el as HTMLElement | undefined;
  if (el) topbarHeight.value = el.offsetHeight;
};

const seletedTaskId = ref<number>();
const inputTitle = ref<string>("");
const inputDescription = ref<string>("");
const inputDeadline = ref<string>("");
const inputStatus = ref<"PENDING" | "IN_PROGRESS" | "DONE">("PENDING");

const searchQuery = ref("");
const statusFilter = ref<"all" | "pending" | "in-progress" | "done">("all");

interface TaskPageResponse {
  tasks: Task[];
  nextCursor: number | null;
  hasMore: boolean;
}

const fetchTasks = () => {
  if (isLoadingTasks.value || !hasMoreTasks.value) return;

  const requestId = activeRequestId;
  isLoadingTasks.value = true;
  const params: Record<string, string | number> = { limit: 10 };
  if (nextCursor.value) params.cursor = nextCursor.value;
  if (statusFilter.value !== "all") params.status = statusFilter.value;
  if (searchQuery.value.trim()) params.title = searchQuery.value.trim();

  axios.get(
    "tasks",
    params,
    (data: TaskPageResponse) => {
      if (requestId !== activeRequestId) return;

      console.log(data.tasks);

      tasks.value.push(...data.tasks);
      nextCursor.value = data.nextCursor;
      hasMoreTasks.value = data.hasMore;
      hasLoadedTasks.value = true;
      isLoadingTasks.value = false;
    },
    () => {
      if (requestId !== activeRequestId) return;

      isLoadingTasks.value = false;
      hasLoadedTasks.value = true;
    },
  );
};

const reloadTasks = () => {
  activeRequestId += 1;
  tasks.value = [];
  nextCursor.value = null;
  hasMoreTasks.value = true;
  hasLoadedTasks.value = false;
  isLoadingTasks.value = false;
  fetchTasks();
};

watch([searchQuery, statusFilter], () => {
  if (filterTimeout) clearTimeout(filterTimeout);
  filterTimeout = setTimeout(reloadTasks, 300);
});

onMounted(() => {
  reloadTasks();
  taskObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) fetchTasks();
    },
    { rootMargin: "200px" },
  );
  if (loadMoreTrigger.value) taskObserver.observe(loadMoreTrigger.value);

  updateTopbarHeight();
  const topbarElNode = topbarEl.value?.$el as HTMLElement | undefined;
  if (topbarElNode) {
    topbarResizeObserver = new ResizeObserver(updateTopbarHeight);
    topbarResizeObserver.observe(topbarElNode);
  }
  window.addEventListener("resize", updateTopbarHeight);
});

onBeforeUnmount(() => {
  if (filterTimeout) clearTimeout(filterTimeout);
  taskObserver?.disconnect();
  topbarResizeObserver?.disconnect();
  window.removeEventListener("resize", updateTopbarHeight);
});

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
    axios.put(
      `tasks/${seletedTaskId.value}`,
      {
        title: inputTitle.value,
        description: inputDescription.value,
        deadline: inputDeadline.value,
        status: inputStatus.value,
      },
      (data: { message: string; task: any }) => {
        const { id, title, description, deadline } = data.task;
        tasks.value = tasks.value.map((task) => {
          if (task.id === id) {
            task.title = title;
            task.description = description;
            task.deadline = deadline;
            task.status = inputStatus.value;
          }
          return task;
        });
      },
      (err: any) => {
        console.log(err);
      },
    );
  } else {
    // Logic Create
    axios.post(
      "tasks/",
      {
        user_id: 1,
        title: inputTitle.value,
        description: inputDescription.value,
        deadline: inputDeadline.value,
      },
      (data: { message: string; task: any }) => {
        const { id, title, description, deadline } = data.task;

        tasks.value.push({
          id,
          title,
          description,
          deadline,
          status: "PENDING",
        });
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  closeModal();
};

const deleteTask = (id: number) => {
  axios.delete(`tasks/${id}`, () => {
    tasks.value = tasks.value.filter((task) => task.id !== id);
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-black font-sans pb-20">
    <!-- Topbar -->
    <!-- TODO: sambungkan @logout ke logic logout kamu -->
    <Topbar ref="topbarEl" />

    <main class="max-w-3xl mx-auto p-6 relative bg-amber-50">
      <!-- Header & Filters -->
      <div
        :style="{ top: topbarHeight + 'px' }"
        class="sticky z-40 mb-6 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b-2 border-black bg-amber-50 pb-4 pt-4 -mx-6 px-6 md:pt-0"
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
            <option value="all">Semua</option>
            <option value="pending">PENDING</option>
            <option value="in-progress">IN PROGRESS</option>
            <option value="done">DONE</option>
          </select>
        </div>
      </div>

      <!-- Stacking List Todo -->
      <div class="flex flex-col gap-3">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="group relative bg-white border-2 border-black p-4 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform hover:-translate-y-0.5"
        >
          <!-- Info Tugas Kiri -->
          <div class="flex-1 w-full">
            <div class="mb-1.5">
              <div class="my-2 flex gap-1">
                <span
                  class="border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase"
                  :class="
                    task.status == 'DONE'
                      ? 'bg-emerald-500 text-white'
                      : task.status == 'IN_PROGRESS'
                        ? 'bg-orange-500 text-white'
                        : 'bg-yellow-500 text-black'
                  "
                >
                  {{ task.status }}
                </span>
                <span
                  class="border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase bg-white"
                >
                  <span v-if="task.deadline">{{
                    new Date(task.deadline).toLocaleDateString()
                  }}</span>
                  <span v-else>-</span>
                </span>
              </div>
              <div class="mt-3">
                <div class="max-w-2xl">
                  <h3
                    class="text-base font-bold leading-none"
                    :class="task.status == 'DONE' && 'line-through'"
                  >
                    {{ task.title }}
                  </h3>
                  <p class="text-sm mt-1 text-gray-700 line-clamp-2">
                    {{ task.description }}
                  </p>
                </div>
                <div class="flex gap-2 justify-end mt-2">
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
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="hasLoadedTasks && tasks.length === 0"
          class="text-center py-10 font-bold border-2 border-black border-dashed text-gray-500 text-sm"
        >
          Belum ada data tugas nih.
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
    </main>

    <!-- Floating Action Button (FAB) -->

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

          <div class="space-y-4 text-sm">
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
                @click="saveTask"
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
