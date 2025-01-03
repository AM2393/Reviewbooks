import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { BookFormModal } from './BookFormModal';

export function AddEditBookButton({ buttonText, mode = 'add', bookData = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={openModal} variant="primary" style={{ backgroundColor: '#714300', borderColor: '#714300' }}>
        {buttonText}
      </Button>
      <BookFormModal show={isModalOpen} onHide={closeModal} mode={mode} initialData={bookData} />
    </>
  );
}
