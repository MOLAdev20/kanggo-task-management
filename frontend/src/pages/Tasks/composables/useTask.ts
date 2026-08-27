import { type Ref, ref, watch, onMounted, onBeforeUnmount } from "vue";
import axios from "../../../utilities/axios.ts";
import type { Task } from "../../../types/task.ts";

interface TaskPageResponse {
  tasks: Task[];
  nextCursor: number | null;
  hasMore: boolean;
}

export function useTasks(loadMoreTrigger: Ref<any>) {
  const tasks = ref<Task[]>([]);
  const nextCursor = ref<number | null>(null);
  const hasMoreTasks = ref(true);
  const isLoadingTasks = ref(false);
  const hasLoadedTasks = ref(false);

  const searchQuery = ref("");
  const statusFilter = ref<"all" | "pending" | "in-progress" | "done">("all");

  let taskObserver: IntersectionObserver | undefined;
  let filterTimeout: ReturnType<typeof setTimeout> | undefined;
  let activeRequestId = 0;

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

  const deleteTask = (id: number) => {
    const confirm = window.confirm("Hapus tugas?");
    if (!confirm) return;
    axios.delete(`tasks/${id}`, () => {
      tasks.value = tasks.value.filter((task) => task.id !== id);
    });
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
  });

  onBeforeUnmount(() => {
    if (filterTimeout) clearTimeout(filterTimeout);
    taskObserver?.disconnect();
  });

  return {
    tasks,
    isLoadingTasks,
    hasLoadedTasks,
    hasMoreTasks,
    searchQuery,
    statusFilter,
    deleteTask,
  };
}
