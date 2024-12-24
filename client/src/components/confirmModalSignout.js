import { useState } from "react";
import Button from "react-bootstrap/Button";

export default function ConfirmModalSignout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false); 
  };

  const closeModal = () => {
    setIsClosing(true); 
    setTimeout(() => {
      setIsModalOpen(false); 
      setIsClosing(false); 
    }, 300); 
  };

  return (
    <div>
      <Button variant="primary" onClick={openModal}>
        Sign out
      </Button>
      {isModalOpen && (
        <div className={`modal-overlay ${isClosing ? "closing" : ""}`}>
          <div className={`modal-content ${isClosing ? "closing" : ""}`}>
            <p>Are you sure you want to sign out from the book club?</p>
            <div className="modal-buttons">
              <Button variant="primary" onClick={closeModal}>
                Sign out
              </Button>
              <Button variant="light" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
