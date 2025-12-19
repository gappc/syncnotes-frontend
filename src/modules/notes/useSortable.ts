import Sortable, { type SortableEvent } from 'sortablejs'
import { onMounted, onUnmounted } from 'vue'

export const useSortable = (
  containerSelector: string,
  onUpdate: (event: SortableEvent) => void,
) => {
  let sortable: Sortable | undefined

  onMounted(() => {
    const notesListContainer = document.querySelector<HTMLUListElement>(containerSelector)
    if (notesListContainer) {
      sortable = Sortable.create(notesListContainer, {
        animation: 150,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        chosenClass: 'bg-emerald-600/50',
        handle: '.handle',
        onUpdate,
      })
    }
  })

  onUnmounted(() => {
    if (sortable) {
      sortable.destroy()
    }
  })
}
