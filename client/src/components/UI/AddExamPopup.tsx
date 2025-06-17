// components/Popup.tsx
import {useEffect, type ReactNode} from "react";
import ReactDOM from "react-dom";

interface AddExamPopupProps {
  children: ReactNode;
  onClose: () => void;
}

const AddExamPopup: React.FC<AddExamPopupProps> = ({ children, onClose }) => {
  const popupRoot = document.getElementById("popup-root");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!popupRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 shadow-xl min-w-[300px] max-w-[90%] transition-transform transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    popupRoot
  );
};

export default AddExamPopup;
