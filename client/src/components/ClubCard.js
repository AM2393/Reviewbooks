/* eslint-disable no-nested-ternary */
import React from 'react';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { useModal } from '../contexts/ModalContext';

const ClubCard = ({ club, isOwner, isMember }) => {
  const { modalMap } = useModal();
  return (
    <Col key={club.id}>
      <Card>
        <Card.Body>
          <div>
            <Card.Title as="h4">{club.name}</Card.Title>
            <Card.Text>{club.description}</Card.Text>
          </div>
          <div className="bottom">
            {isOwner ? (
              <Button variant="secondary" disabled>
                You're owner
              </Button>
            ) : isMember ? (
              <Button variant="light" disabled>
                You're member
              </Button>
            ) : (
              <Button variant="primary" onClick={() => modalMap.openJoinClub(club)}>
                Join the club
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ClubCard;
