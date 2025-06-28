import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./PageButton.css";
import { DRAG_STYLES, ANIMATION_DURATIONS, type Page } from "../constants";

interface PageProps {
  page: Page;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isNewlyAdded?: boolean;
  isDeleting?: boolean;
  isOver?: boolean;
}

const PageButton: React.FC<PageProps> = React.memo(({
  page,
  onSelect,
  onContextMenu,
  isDragging = false,
  isNewlyAdded = false,
  isDeleting = false,
  isOver = false,
}) => {
  const [settleState, setSettleState] = useState<'none' | 'fast' | 'momentum' | 'physics' | 'ultra' | 'jello' | 'liquid' | 'elastic'>('none');
  const [wasJustDragging, setWasJustDragging] = useState(false);
  const [dragVelocity, setDragVelocity] = useState({ x: 0, y: 0 });
  const [isBridging, setIsBridging] = useState(false);
  
  const dragStartTimeRef = useRef<number>(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const settleTimeoutRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: page.id });

  // Track drag velocity for physics simulation
  useEffect(() => {
    if (transform && isSortableDragging) {
      const now = Date.now();
      const currentPos = { x: transform.x, y: transform.y };
      
      if (lastTimeRef.current > 0) {
        const deltaTime = now - lastTimeRef.current;
        const deltaX = currentPos.x - lastPosRef.current.x;
        const deltaY = currentPos.y - lastPosRef.current.y;
        
        if (deltaTime > 0) {
          setDragVelocity({
            x: deltaX / deltaTime,
            y: deltaY / deltaTime
          });
        }
      }
      
      lastPosRef.current = currentPos;
      lastTimeRef.current = now;
    }
  }, [transform, isSortableDragging]);

  // Enhanced physics-based settling
  useEffect(() => {
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
    }

    if (isSortableDragging || isDragging) {
      setWasJustDragging(true);
      setSettleState('none');
      dragStartTimeRef.current = Date.now();
      lastTimeRef.current = 0;
    } else if (wasJustDragging && !isSortableDragging && !isDragging) {
      // Immediately blur to prevent focus outline
      if (buttonRef.current) {
        buttonRef.current.blur();
        // Additional approach: remove tabindex temporarily
        buttonRef.current.style.outline = 'none';
        buttonRef.current.style.outlineOffset = '0';
      }
      
      // Add bridge transition first, then settle
      setIsBridging(true);
      setTimeout(() => {
        setIsBridging(false);
        
        const dragDuration = Date.now() - dragStartTimeRef.current;
        const speed = Math.sqrt(dragVelocity.x ** 2 + dragVelocity.y ** 2);
        const distance = Math.sqrt(
          (lastPosRef.current.x) ** 2 + (lastPosRef.current.y) ** 2
        );
        
        // Advanced physics detection based on multiple factors
        let physicsType: 'fast' | 'momentum' | 'physics' | 'ultra' | 'jello' | 'liquid' | 'elastic' = 'physics';
        let duration: number = ANIMATION_DURATIONS.DRAG_SETTLE;
        
        // Elastic for extremely energetic, chaotic drags
        if (dragDuration > 2000 && speed > 2.5 && distance > 250) {
          physicsType = 'elastic';
          duration = 2800;
        }
        // Liquid settle for extremely long, complex drags
        else if (dragDuration > 1500 && speed > 2 && distance > 200) {
          physicsType = 'liquid';
          duration = 2500;
        }
        // Jello effect for very long, energetic drags
        else if (dragDuration > 1000 && speed > 1.5 && distance > 150) {
          physicsType = 'jello';
          duration = 2200;
        }
        // Ultra spring for long, fast drags with significant distance
        else if (dragDuration > 800 && speed > 1.2 && distance > 100) {
          physicsType = 'ultra';
          duration = 1800;
        }
        // Fast settle for very quick drags
        else if (dragDuration < 200) {
          physicsType = 'fast';
          duration = 600;
        }
        // Momentum for high-velocity drags
        else if (speed > 0.5) {
          physicsType = 'momentum';
          duration = ANIMATION_DURATIONS.MOMENTUM_SETTLE;
        }
        // Default physics settle
        else {
          physicsType = 'physics';
          duration = ANIMATION_DURATIONS.DRAG_SETTLE;
        }
        
        setSettleState(physicsType);
        
        settleTimeoutRef.current = window.setTimeout(() => {
          setSettleState('none');
          setWasJustDragging(false);
          setDragVelocity({ x: 0, y: 0 });
          // Blur the element after settle animation to remove any focus outline
          if (buttonRef.current) {
            buttonRef.current.blur();
            // Force remove any potential focus styles
            buttonRef.current.style.outline = 'none';
            buttonRef.current.style.outlineOffset = '0';
          }
        }, duration);
      }, 120); // Bridge duration
    }

    return () => {
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
      }
    };
  }, [isSortableDragging, isDragging, wasJustDragging, dragVelocity, transform]);

  const shouldDisableTransition = isSortableDragging || isDragging || settleState !== 'none';
  
  // During settle animations, let CSS handle opacity completely
  // Only hide during active dragging to prevent double-visibility
  const shouldHideOriginal = isSortableDragging;
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: shouldDisableTransition ? 'none' : transition,
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
      } ${isNewlyAdded ? "newly-added" : ""} ${isDeleting ? "deleting" : ""} ${
        isBridging ? "drag-bridge" : ""
      } ${
        settleState === 'fast' ? "drag-settling-fast" : 
        settleState === 'momentum' ? "drag-settling-momentum" : 
        settleState === 'physics' ? "drag-settling-physics" : 
        settleState === 'ultra' ? "drag-settling-ultra" : 
        settleState === 'jello' ? "drag-settling-jello" : 
        settleState === 'liquid' ? "drag-settling-liquid" : 
        settleState === 'elastic' ? "drag-settling-elastic" : ""
      } ${isOver ? "drag-over" : ""}`}
      data-page={page.name}
      role="button"
      tabIndex={0}
      aria-label={`${page.name} page${page.isActive ? ' (active)' : ''}`}
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
});

export default PageButton;
