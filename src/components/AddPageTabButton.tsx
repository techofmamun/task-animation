import './AddPageTabButton.css'

interface AddPageTabButtonProps {
  onAdd: () => void
}

const AddPageTabButton = ({ onAdd }: AddPageTabButtonProps) => {
  return (
    <button className="add-page-tab-button" onClick={onAdd}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3V13M3 8H13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      Add Page
    </button>
  )
}

export default AddPageTabButton
