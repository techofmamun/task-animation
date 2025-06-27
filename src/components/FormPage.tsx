import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Page } from './FormPageManager'
import './FormPage.css'

interface FormPageProps {
  page: Page
  onSelect: () => void
  onContextMenu: (e: React.MouseEvent) => void
  isDragging?: boolean
}

const FormPage = ({ page, onSelect, onContextMenu, isDragging = false }: FormPageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: page.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: isSortableDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`form-page ${page.isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
      data-page={page.name}
      onClick={(e) => {
        e.stopPropagation()
        if (!isSortableDragging) {
          onSelect()
        }
      }}
      onContextMenu={onContextMenu}
    >
      <div className="page-content">
        <span className="page-name">{page.name}</span>
      </div>
    </div>
  )
}

export default FormPage
