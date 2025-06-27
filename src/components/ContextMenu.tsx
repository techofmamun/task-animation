import { useEffect, useState, useCallback } from "react";
import "./ContextMenu.css";
import { RenameIcon, CopyIcon, DuplicateIcon, DeleteIcon } from "../assets/icons";
import { UI_TEXT } from "../constants";

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

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 150); // Match the animation duration
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Close when clicking outside the menu
      const target = e.target as Element;
      if (!target.closest('.context-menu')) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  const handleMenuItemClick = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <div
      className={`context-menu ${isClosing ? 'closing' : ''}`}
      style={{ left: x, top: y }}
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
