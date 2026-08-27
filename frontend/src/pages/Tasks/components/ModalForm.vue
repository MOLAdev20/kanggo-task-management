<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "../../../types/task";

const props = defineProps<{
  isModalOpen: boolean;
  isEditing: boolean;
  inputTitle: string;
  inputDescription: string;
  inputDeadline: string;
  inputStatus: Task["status"];
  errorMessage: string;
}>();

const emit = defineEmits<{
  "update:inputTitle": [value: string];
  "update:inputDescription": [value: string];
  "update:inputDeadline": [value: string];
  "update:inputStatus": [value: Task["status"]];
  close: [];
  save: [];
}>();

const inputTitle = computed({
  get: () => props.inputTitle,
  set: (value: string) => emit("update:inputTitle", value),
});
const inputDescription = computed({
  get: () => props.inputDescription,
  set: (value: string) => emit("update:inputDescription", value),
});
const inputDeadline = computed({
  get: () => props.inputDeadline,
  set: (value: string) => emit("update:inputDeadline", value),
});
const inputStatus = computed({
  get: () => props.inputStatus,
  set: (value: Task["status"]) => emit("update:inputStatus", value),
});
</script>
<template>
  <Transition name="modal-anim">
    <div
      v-if="props.isModalOpen"
      class="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div
        class="bg-white border-2 border-black w-full max-w-sm shadow-[6px_6px_0px_rgba(0,0,0,1)] p-6 relative"
      >
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 font-bold text-2xl hover:text-red-500 leading-none"
        >
          &times;
        </button>
        <div class="mb-5">
          <h2 class="text-xl font-extrabold">
            {{ props.isEditing ? "Edit Tugas" : "Tambah Tugas" }}
          </h2>
          <p
            v-if="props.errorMessage != ''"
            class="text-xs font-medium text-red-500"
          >
            {{ props.errorMessage }}
          </p>
        </div>

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
              @click="emit('close')"
              class="flex-1 bg-white border-2 border-black py-2 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              @click="emit('save')"
              class="flex-1 bg-[#FFD000] border-2 border-black py-2 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
<style>
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
