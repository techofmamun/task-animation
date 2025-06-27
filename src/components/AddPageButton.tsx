import './AddPageButton.css'
import { PlusIcon } from '../assets/icons'

interface AddPageButtonProps {
  onAdd: () => void
}

const AddPageButton = ({ onAdd }: AddPageButtonProps) => {
  return (
    <div className="add-page-button-container">
      <div className="add-page-button" onClick={onAdd}>
        <PlusIcon />
      </div>
    </div>
  )
}

export default AddPageButton
