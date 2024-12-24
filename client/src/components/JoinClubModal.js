import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { SERVER_API } from '../constants/constants';

import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';

const JoinClubModal = () => {
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const { state } = useAuth();
  const { isJoinClubOpen, clubToJoin, modalMap } = useModal();
  const navigate = useNavigate();

  const handleCloseAlert = () => setShowAlert(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(null);
    setIsPending(true);

    let clubMembershipData = {};
    try {
      const clubMembershipResponse = await fetch(`${SERVER_API}/clubs/member/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: state.user?.id, clubId: clubToJoin.id }),
      });

      clubMembershipData = await clubMembershipResponse.json();

      if (!clubMembershipResponse.ok) {
        setShowAlert(clubMembershipData.message);
        setIsPending(false);
        return;
      }
    } catch (err) {
      setShowAlert(err.message);
      setIsPending(false);
      return;
    }

    navigate(`/club/${clubMembershipData.clubId}`);
    modalMap.closeJoinClub();
    setIsPending(false);
  };

  return (
    <Modal show={isJoinClubOpen} onHide={modalMap.closeJoinClub}>
      <Form onSubmit={handleSubmit} className="form">
        {isPending && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
        <Modal.Header closeButton>
          <Modal.Title>Join the club</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="joinClub.clubId">
            <Form.Control type="hidden" value={clubToJoin?.id} name="clubId" />
          </Form.Group>
          <Form.Group controlId="joinClub.userId">
            <Form.Control type="hidden" value={state.user?.id} name="userId" />
          </Form.Group>
          <p>
            Really want to join the <strong>{clubToJoin?.name}</strong> club?
          </p>
          <Alert show={!!showAlert} variant="danger" dismissible onClose={handleCloseAlert}>
            <pre>{showAlert}</pre>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalMap.closeJoinClub}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Join club
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default JoinClubModal;
