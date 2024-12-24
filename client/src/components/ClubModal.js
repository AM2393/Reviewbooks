import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { useAuth } from '../contexts/AuthContext';

import { SERVER_API } from '../constants/constants';

const ClubModal = ({ setShowCreateClub }) => {
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();
  const { state } = useAuth();

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

    if (state.user.id) {
      // eslint-disable-next-line camelcase
      data.user_id = state.user.id;
    }

    try {
      const newClubResponse = await fetch(`${SERVER_API}/clubs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!newClubResponse.ok) {
        setShowAlert(newClubResponse.message);
        setValidated(false);
        setIsPending(false);
        return;
      }

      const newClubData = await newClubResponse.json();

      setShowCreateClub(false);
      setIsPending(false);

      navigate(`/club/${newClubData.id}`);
    } catch (error) {
      setShowAlert(JSON.stringify(error));
      setIsPending(false);
    }
  };

  return (
    <Modal show={true} onHide={() => setShowCreateClub(false)}>
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="form">
        {isPending && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
        <Modal.Header closeButton>
          <Modal.Title>Create new club</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="createClub.name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" required />
            <Form.Control.Feedback type="invalid">Please enter a name</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="createClub.description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" required minLength={6} />
            <Form.Control.Feedback type="invalid">Please enter at least 6 characters description</Form.Control.Feedback>
          </Form.Group>
          <Alert show={!!showAlert} variant="danger" dismissible onClose={handleCloseAlert}>
            <pre>{showAlert}</pre>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateClub(false)}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Create Club
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ClubModal;
