import { useEffect, useState, useCallback, useRef } from "react";
import "./ContextMenu.css";
import { RenameIcon, CopyIcon, DuplicateIcon, DeleteIcon } from "../assets/icons";
import { UI_TEXT, ANIMATION_DURATIONS } from "../constants";

interface ContextMenuProps {
  x: number;
  y: number;
  onSetAsFirst: () => void;
  onRename: () => void;
  onCopy: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
  canDelete?: boolean;
}

const ContextMenu = ({
  x,
  y,
  onRename,
  onCopy,
  onDuplicate,
  onDelete,
  onClose,
  canDelete = true,
}: ContextMenuProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y });
  const menuRef = useRef<HTMLDivElement>(null);

  // Adjust position to keep menu within viewport bounds
  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = x;
      let adjustedY = y;
      
      // Define margins based on screen size
      const isMobile = viewportWidth <= 768;
      const margin = isMobile ? 12 : 16;
      
      // Adjust horizontal position
      if (x + menuRect.width > viewportWidth - margin) {
        adjustedX = viewportWidth - menuRect.width - margin;
      }
      if (adjustedX < margin) {
        adjustedX = margin;
      }
      
      // Adjust vertical position
      if (y + menuRect.height > viewportHeight - margin) {
        adjustedY = viewportHeight - menuRect.height - margin;
      }
      if (adjustedY < margin) {
        adjustedY = margin;
      }
      
      // On mobile, prefer positioning above the touch point if there's more space
      if (isMobile && y > viewportHeight / 2) {
        const spaceAbove = y - margin;
        const spaceBelow = viewportHeight - y - margin;
        if (spaceAbove > menuRect.height && spaceAbove > spaceBelow) {
          adjustedY = y - menuRect.height - 8; // 8px gap from touch point
        }
      }
      
      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, ANIMATION_DURATIONS.CONTEXT_MENU_TRANSITION); // Match the animation duration
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      // Close when clicking outside the menu
      const target = e.target as Element;
      if (!target.closest('.context-menu')) {
        handleClose();
      }
    };

    const handleResize = () => {
      // Recalculate position on window resize (orientation change, etc.)
      if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let adjustedX = adjustedPosition.x;
        let adjustedY = adjustedPosition.y;
        
        const isMobile = viewportWidth <= 768;
        const margin = isMobile ? 12 : 16;
        
        // Re-adjust if menu would now be outside viewport
        if (adjustedX + menuRect.width > viewportWidth - margin) {
          adjustedX = viewportWidth - menuRect.width - margin;
        }
        if (adjustedX < margin) {
          adjustedX = margin;
        }
        
        if (adjustedY + menuRect.height > viewportHeight - margin) {
          adjustedY = viewportHeight - menuRect.height - margin;
        }
        if (adjustedY < margin) {
          adjustedY = margin;
        }
        
        setAdjustedPosition({ x: adjustedX, y: adjustedY });
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleClose, adjustedPosition]);

  const handleMenuItemClick = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <div
      ref={menuRef}
      className={`context-menu ${isClosing ? 'closing' : ''}`}
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-header">{UI_TEXT.contextMenu.header}</div>
      <button className="context-menu-item" onClick={() => handleMenuItemClick(onRename)}>
        <RenameIcon />
        {UI_TEXT.contextMenu.rename}
      </button>
      <button className="context-menu-item" onClick={() => handleMenuItemClick(onCopy)}>
        <CopyIcon />
        {UI_TEXT.contextMenu.copy}
      </button>
      <button className="context-menu-item" onClick={() => handleMenuItemClick(onDuplicate)}>
        <DuplicateIcon />
        {UI_TEXT.contextMenu.duplicate}
      </button>
      <div className="context-menu-separator" />
      <button 
        className={`context-menu-item danger ${!canDelete ? 'disabled' : ''}`} 
        onClick={() => canDelete && handleMenuItemClick(onDelete)}
        disabled={!canDelete}
      >
        <DeleteIcon />
        {UI_TEXT.contextMenu.delete}
      </button>
    </div>
  );
};

export default ContextMenu;
