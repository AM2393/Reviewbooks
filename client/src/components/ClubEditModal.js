import React, { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { useModal } from '../contexts/ModalContext';

import { SERVER_API } from '../constants/constants';

const ClubEditModal = ({ club }) => {
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const { isClubEditOpen, modalMap } = useModal();

  const handleCloseAlert = () => setShowAlert(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(null);
    setIsPending(true);

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setValidated(true);

    if (!form.checkValidity()) {
      e.stopPropagation();
      setIsPending(false);
      return;
    }

    try {
      const editClubResponse = await fetch(`${SERVER_API}/clubs/${club.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!editClubResponse.ok) {
        setShowAlert('Club could not be updated');
        setValidated(false);
        setIsPending(false);
        return;
      }

      setIsPending(false);
      modalMap.closeClubEdit();
      window.location.reload();
    } catch (error) {
      setShowAlert(JSON.stringify(error));
      setIsPending(false);
    }
  };

  return (
    <Modal show={isClubEditOpen} onHide={() => modalMap.closeClubEdit()}>
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="form">
        {isPending && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
        <Modal.Header closeButton>
          <Modal.Title>Edit club</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="editClub.name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" defaultValue={club.name} required />
            <Form.Control.Feedback type="invalid">Please enter a name</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="editClub.description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              defaultValue={club.description}
              required
              minLength={6}
            />
            <Form.Control.Feedback type="invalid">Please enter at least 6 characters description</Form.Control.Feedback>
          </Form.Group>
          <Alert show={!!showAlert} variant="danger" dismissible onClose={handleCloseAlert}>
            <pre>{showAlert}</pre>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => modalMap.closeClubEdit()}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Edit Club
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ClubEditModal;
