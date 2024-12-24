import React, { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';

import { useModal } from '../contexts/ModalContext';

import { SERVER_API } from '../constants/constants';

const ClubMembersModal = ({ club }) => {
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [members, setMembers] = useState([]);
  const [moderator, setModerator] = useState(null);

  const { isClubMembersOpen, modalMap } = useModal();

  const handleCloseAlert = () => setShowAlert(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const membersResponse = await fetch(`${SERVER_API}/clubs/${club.id}/members`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!membersResponse.ok) {
          setShowAlert('Members could not be loaded');
          setIsPending(false);
          return;
        }

        const memberList = await membersResponse.json();

        setMembers(memberList);
        setIsPending(false);
      } catch (error) {
        setShowAlert(JSON.stringify(error));
        setIsPending(false);
        return;
      }

      try {
        const moderatorResponse = await fetch(`${SERVER_API}/users/${club.user_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!moderatorResponse.ok) {
          setShowAlert('Moderator could not be loaded');
          setIsPending(false);
          return;
        }

        const mod = await moderatorResponse.json();

        setModerator(mod);
        setIsPending(false);
      } catch (error) {
        setShowAlert(JSON.stringify(error));
        setIsPending(false);
        return;
      }
    };

    loadMembers();
  }, []);

  return (
    <Modal show={isClubMembersOpen} onHide={() => modalMap.closeClubMembers()}>
      {isPending && (
        <div className="spinner-wrapper">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Modal.Header closeButton>
        <Modal.Title>Club Members</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="moderator">
          <span className="name">
            {moderator?.first_name} {moderator?.last_name}
            <Badge bg="dark">Moderator</Badge>
          </span>
          <span className="email">{moderator?.email}</span>
        </div>
        <div className="member-list">
          {members.length > 0 &&
            members.map((member) => (
              <div key={member.id} className="member">
                <span className="name">
                  {member.first_name} {member.last_name}
                </span>
                <span className="email">{member.email}</span>
              </div>
            ))}
          {members.length === 0 && <Alert variant="light">There are 0 members.</Alert>}
        </div>
        <Alert show={!!showAlert} variant="danger" dismissible onClose={handleCloseAlert}>
          <pre>{showAlert}</pre>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => modalMap.closeClubMembers()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClubMembersModal;
