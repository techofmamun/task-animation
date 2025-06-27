import React from "react";
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

const FormPage: React.FC<FormPageProps> = React.memo(({
  page,
  onSelect,
  onContextMenu,
  isDragging = false,
  isNewlyAdded = false,
  isDeleting = false,
}) => {
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

  const handleClick = (e: React.MouseEvent) => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (!isSortableDragging) {
        if (page.isActive) {
          // For keyboard accessibility, we'll trigger context menu at the center of the element
          const rect = e.currentTarget.getBoundingClientRect();
          const fakeMouseEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
            currentTarget: e.currentTarget,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          } as React.MouseEvent;
          onContextMenu(fakeMouseEvent);
        } else {
          onSelect();
        }
      }
    }
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
      role="button"
      tabIndex={0}
      aria-label={`${page.name} page${page.isActive ? ' (active)' : ''}`}
      aria-pressed={page.isActive}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="page-content">
        {page.icon}
        <span className="page-name">{page.name}</span>
      </div>
    </div>
  );
});

export default FormPage;
