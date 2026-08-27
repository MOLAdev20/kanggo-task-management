<script setup lang="ts">
import { SquarePen, Trash2 } from "@lucide/vue";
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
              class="bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all flex items-center justify-center cursor-pointer h-8 w-8"
            >
              <SquarePen />
            </button>
            <button
              @click="emit('deleteTask', task.id)"
              class="bg-red-500 text-white border-2 border-black p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all flex items-center justify-center cursor-pointer h-8 w-8"
            >
              <Trash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
