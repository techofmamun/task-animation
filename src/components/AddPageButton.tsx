import './AddPageButton.css'

interface AddPageButtonProps {
  onAdd: () => void
}

const AddPageButton = ({ onAdd }: AddPageButtonProps) => {
  return (
    <div className="add-page-button-container">
      <div className="add-page-button" onClick={onAdd}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3V13M3 8H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default AddPageButton
