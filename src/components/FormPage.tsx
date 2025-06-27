import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./FormPage.css";
import { DRAG_STYLES, type Page } from "../constants";

interface FormPageProps {
  page: Page;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isNewlyAdded?: boolean;
  isDeleting?: boolean;
}

const FormPage = ({
  page,
  onSelect,
  onContextMenu,
  isDragging = false,
  isNewlyAdded = false,
  isDeleting = false,
}: FormPageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1, // Hide the original when dragging
    zIndex: isSortableDragging ? DRAG_STYLES.zIndex : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`form-page ${page.isActive ? "active" : ""} ${
        isDragging ? "dragging" : ""
      } ${isNewlyAdded ? "newly-added" : ""} ${isDeleting ? "deleting" : ""}`}
      data-page={page.name}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSortableDragging) {
          if (page.isActive) {
            // If page is already active, show context menu
            onContextMenu(e);
          } else {
            // If page is not active, select it
            onSelect();
          }
        }
      }}
    >
      <div className="page-content">
        {page.icon}
        <span className="page-name">{page.name}</span>
      </div>
    </div>
  );
};

export default FormPage;
