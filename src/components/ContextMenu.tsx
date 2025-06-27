import { useEffect } from 'react'
import './ContextMenu.css'

interface ContextMenuProps {
  x: number
  y: number
  onSetAsFirst: () => void
  onRename: () => void
  onCopy: () => void
  onDuplicate: () => void
  onDelete: () => void
  onClose: () => void
}

const ContextMenu = ({ x, y, onSetAsFirst, onRename, onCopy, onDuplicate, onDelete, onClose }: ContextMenuProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      className="context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-header">
        Settings
      </div>
      <button className="context-menu-item" onClick={onSetAsFirst}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="6" width="8" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="10" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
        Set as first page
      </button>
      <button className="context-menu-item" onClick={onRename}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12.146 1.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708L6.207 12.5H3.5v-2.707L12.146 1.146zM4.5 10.207L12.5 2.207 13.793 3.5 5.793 11.5H4.5v-1.293z"
            fill="currentColor"
          />
        </svg>
        Rename
      </button>
      <button className="context-menu-item" onClick={onCopy}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H7.5L6 1H4z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        Copy
      </button>
      <button className="context-menu-item" onClick={onDuplicate}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-1H15a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-8.5a2 2 0 0 0-2 2v-2zM5.5 2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V2zm-2 1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1v-1H6a1.5 1.5 0 0 1-1.5-1.5V3z"
            fill="currentColor"
          />
        </svg>
        Duplicate
      </button>
      <div className="context-menu-separator" />
      <button className="context-menu-item danger" onClick={onDelete}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            fill="currentColor"
          />
        </svg>
        Delete
      </button>
    </div>
  )
}

export default ContextMenu
