import { type Ref, ref, onMounted, onBeforeUnmount } from "vue";

export function useTopbarLayout(topbarEl: Ref<any>) {
  const topbarHeight = ref(0);
  let topbarResizeObserver: ResizeObserver | undefined;

  const updateTopbarHeight = () => {
    const el = topbarEl.value?.$el as HTMLElement | undefined;
    if (el) topbarHeight.value = el.offsetHeight;
  };

  onMounted(() => {
    updateTopbarHeight();
    const topbarElNode = topbarEl.value?.$el as HTMLElement | undefined;
    if (topbarElNode) {
      topbarResizeObserver = new ResizeObserver(updateTopbarHeight);
      topbarResizeObserver.observe(topbarElNode);
    }
    window.addEventListener("resize", updateTopbarHeight);
  });

  onBeforeUnmount(() => {
    topbarResizeObserver?.disconnect();
    window.removeEventListener("resize", updateTopbarHeight);
  });

  return { topbarHeight };
}
