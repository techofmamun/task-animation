import { useEffect } from "react";
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
}

const ContextMenu = ({
  x,
  y,
  onRename,
  onCopy,
  onDuplicate,
  onDelete,
  onClose,
}: ContextMenuProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-header">{UI_TEXT.contextMenu.header}</div>
      <button className="context-menu-item" onClick={onRename}>
        <RenameIcon />
        {UI_TEXT.contextMenu.rename}
      </button>
      <button className="context-menu-item" onClick={onCopy}>
        <CopyIcon />
        {UI_TEXT.contextMenu.copy}
      </button>
      <button className="context-menu-item" onClick={onDuplicate}>
        <DuplicateIcon />
        {UI_TEXT.contextMenu.duplicate}
      </button>
      <div className="context-menu-separator" />
      <button className="context-menu-item danger" onClick={onDelete}>
        <DeleteIcon />
        {UI_TEXT.contextMenu.delete}
      </button>
    </div>
  );
};

export default ContextMenu;
