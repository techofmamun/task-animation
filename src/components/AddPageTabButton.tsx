import "./AddPageTabButton.css";
import { PlusIcon } from "../assets/icons";
import { UI_TEXT } from "../constants";

interface AddPageTabButtonProps {
  onAdd: () => void;
}

const AddPageTabButton = ({ onAdd }: AddPageTabButtonProps) => {
  return (
    <button className="add-page-tab-button" onClick={onAdd}>
      <PlusIcon />
      {UI_TEXT.buttons.addPage}
    </button>
  );
};

export default AddPageTabButton;
