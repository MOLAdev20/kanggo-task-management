import { ref, type Ref } from "vue";
import axios from "../../../utilities/axios.ts";
import type { Task } from "../../../types/task.ts";

const isModalOpen = ref(false);

export function useTaskModal(tasks: Ref<Task[]>) {
  const isEditing = ref(false);
  const seletedTaskId = ref<number>();
  const inputTitle = ref("");
  const inputDescription = ref("");
  const inputDeadline = ref("");
  const inputStatus = ref<"PENDING" | "IN_PROGRESS" | "DONE">("PENDING");
  const errorMessage = ref("");

  const openModal = (task: null | Task = null) => {
    if (task) {
      isEditing.value = true;
      seletedTaskId.value = task.id;
      inputTitle.value = task.title;
      inputDescription.value = task.description;
      inputStatus.value = task.status;
      inputDeadline.value = task.deadline
        ? new Date(task.deadline).toISOString().split("T")[0]
        : "";
    } else {
      isEditing.value = false;
      seletedTaskId.value = undefined;
      inputTitle.value = "";
      inputDescription.value = "";
      inputDeadline.value = "";
      inputStatus.value = "PENDING";
    }
    errorMessage.value = "";
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
          const updatedTask = data.task as Task;
          tasks.value = tasks.value.map((task) => {
            if (task.id === updatedTask.id) {
              return {
                ...task,
                ...updatedTask,
              };
            }
            closeModal();
            return task;
          });
        },
        (err: any) => {
          if (err.response.status === 400) {
            errorMessage.value = "Judul tugas wajib diisi";
          } else {
            errorMessage.value = "Terjadi kesalahan";
          }
          console.log(err);
        },
      );
    } else {
      axios.post(
        "tasks/",
        {
          user_id: 1,
          title: inputTitle.value,
          description: inputDescription.value,
          deadline: inputDeadline.value,
        },
        (data: { message: string; task: any }) => {
          tasks.value.unshift(data.task as Task);
          closeModal();
        },
        (err: any) => {
          if (err.response.status === 400) {
            errorMessage.value = "Judul tugas wajib diisi";
          } else {
            errorMessage.value = "Terjadi kesalahan";
          }
          console.log(err);
        },
      );
    }
  };

  return {
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
  };
}
