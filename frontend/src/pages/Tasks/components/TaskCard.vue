<script setup lang="ts">
import type { Task } from "../../../types/task";

const props = defineProps<{
  tasks: Task[];
}>();

const emit = defineEmits(["openModal", "deleteTask"]);
</script>
<template>
  <div
    v-for="task in props.tasks"
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
              @click="emit('openModal', task)"
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
              @click="emit('deleteTask', task.id)"
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
</template>
