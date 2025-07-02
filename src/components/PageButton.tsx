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
    const [settleState, setSettleState] = useState<"none" | "spring">("none");
    const [wasJustDragging, setWasJustDragging] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const dragStartPosRef = useRef({ x: 0, y: 0 }); // Store initial drag position
    const maxDistanceRef = useRef(0); // Track maximum distance reached

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isSortableDragging,
    } = useSortable({ id: page.id });

    // Track drag distance with global mouse/touch events
    useEffect(() => {
      if (isSortableDragging) {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
          // Only track if we have a valid drag start position
          if (
            dragStartPosRef.current.x === 0 &&
            dragStartPosRef.current.y === 0
          )
            return;

          const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
          const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

          // Calculate current distance from drag start
          const distance = Math.sqrt(
            Math.pow(clientX - dragStartPosRef.current.x, 2) +
              Math.pow(clientY - dragStartPosRef.current.y, 2)
          );

          // Track maximum distance reached
          if (distance > maxDistanceRef.current) {
            maxDistanceRef.current = distance;
          }
        };

        // Add event listeners
        document.addEventListener("mousemove", handleGlobalMove);
        document.addEventListener("touchmove", handleGlobalMove);

        return () => {
          document.removeEventListener("mousemove", handleGlobalMove);
          document.removeEventListener("touchmove", handleGlobalMove);
        };
      }
    }, [isSortableDragging]);

    // handle settling state with animation
    useEffect(() => {
      if (isSortableDragging || isDragging) {
        // Only initialize on the first drag start (prevent multiple resets)
        if (!wasJustDragging) {
          setWasJustDragging(true);
          setSettleState("none");

          // Reset drag tracking when drag starts
          maxDistanceRef.current = 0;

          // Use the element's center position as the drag start reference (only once)
          if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            dragStartPosRef.current = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };
          }
        }
      } else if (wasJustDragging && !isSortableDragging && !isDragging) {
        setTimeout(() => {
          const dragDistance = maxDistanceRef.current;
          console.log(`Drag distance: ${dragDistance}px`);

          let duration: number;
          let springIntensity: number;
          if (dragDistance < 200) {
            duration = 400;
            springIntensity = 0.8;
          } else if (dragDistance < 400) {
            // Smooth curve between the extremes
            duration = 400;
            springIntensity = 1;
          } else if (dragDistance < 800) {
            // Smooth curve between the extremes
            duration = 600;
            springIntensity = 1;
          } else {
            // Cap the maximum values for very large drags
            duration = 800;
            springIntensity = 1;
          }

          setSettleState("spring");

          // Set the dynamic duration and intensity via CSS custom properties
          if (buttonRef.current) {
            buttonRef.current.style.setProperty(
              "--spring-duration",
              `${duration}ms`
            );
            buttonRef.current.style.setProperty(
              "--spring-intensity",
              springIntensity.toString()
            );
          }
          setTimeout(
            () => {
              setSettleState("none");
              setWasJustDragging(false);
            },
            duration - 200 > 400 ? duration - 200 : 400
          ); // Ensure minimum duration
        }, 120); // Bridge duration
      }
    }, [isSortableDragging, isDragging, wasJustDragging, transform]);

    // We no longer need to track velocity as we're using a pure distance-based animation

    const shouldDisableTransition =
      isSortableDragging || isDragging || settleState !== "none";

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
        }  ${settleState === "spring" ? "drag-settling-spring" : ""} ${
          isOver ? "drag-over" : ""
        }`}
        data-page={page.name}
        role="button"
        tabIndex={0}
        aria-label={`${page.name} page${page.isActive ? " (active)" : ""}`}
        aria-pressed={page.isActive}
        onClick={handleClick}
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
