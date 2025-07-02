import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useRef, useState } from "react";

import { DRAG_STYLES, type Page } from "../constants";
import "./PageButton.css";

interface PageProps {
  page: Page;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isNewlyAdded?: boolean;
  isDeleting?: boolean;
  isOver?: boolean;
}

const PageButton: React.FC<PageProps> = React.memo(
  ({
    page,
    onSelect,
    onContextMenu,
    isDragging = false,
    isNewlyAdded = false,
    isDeleting = false,
    isOver = false,
  }) => {
    const [settleState, setSettleState] = useState<"settle" | "none">("none");
    const [wasJustDragging, setWasJustDragging] = useState(false);
    const [isBridging, setIsBridging] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isSortableDragging,
    } = useSortable({ id: page.id });

    // Enhanced physics-based settling
    useEffect(() => {

      if (isSortableDragging || isDragging) {
        setWasJustDragging(true);
        setSettleState("none");
      } else if (wasJustDragging && !isSortableDragging && !isDragging) {
        // Add bridge transition first, then settle
        setIsBridging(true);
        setTimeout(() => {
          setIsBridging(false);
          setSettleState("settle");
        }, 120); // Bridge duration
      }

    }, [isSortableDragging, isDragging, wasJustDragging, transform]);

    const shouldDisableTransition =
      isSortableDragging || isDragging || settleState !== "none";

    // During settle animations, let CSS handle opacity completely
    // Only hide during active dragging to prevent double-visibility
    const shouldHideOriginal = isSortableDragging;

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: shouldDisableTransition ? "none" : transition,
      // Only apply opacity during dragging, not during settling
      ...(shouldHideOriginal && { opacity: 0 }),
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
      if (e.key === "Enter" || e.key === " ") {
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

    const handleFocus = (e: React.FocusEvent) => {
      // Prevent focus during drag operations
      if (isSortableDragging || isDragging || wasJustDragging) {
        e.preventDefault();
        (e.currentTarget as HTMLElement).blur();
      }
    };

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          buttonRef.current = node;
        }}
        style={style}
        {...attributes}
        {...listeners}
        className={`form-page ${page.isActive ? "active" : ""} ${
          isDragging ? "dragging" : ""
        } ${isNewlyAdded ? "newly-added" : ""} ${
          isDeleting ? "deleting" : ""
        } ${isBridging ? "drag-bridge" : ""} ${
          settleState === "settle" ? "drag-settling-physics" : ""
        } ${isOver ? "drag-over" : ""}`}
        data-page={page.name}
        role="button"
        tabIndex={0}
        aria-label={`${page.name} page${page.isActive ? " (active)" : ""}`}
        aria-pressed={page.isActive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      >
        <div className="page-content">
          {page.icon}
          <span className="page-name">{page.name}</span>
        </div>
      </div>
    );
  }
);

export default PageButton;
