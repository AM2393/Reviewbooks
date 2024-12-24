/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';

import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import ClubCard from './ClubCard';
import JoinClubModal from './JoinClubModal';

import { SERVER_API } from '../constants/constants';

import { useAuth } from '../contexts/AuthContext';

const ClubsList = () => {
  const [clubs, setClubs] = useState(null);
  const [userClubs, setUserClubs] = useState([]);
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setPending] = useState(true);

  const { state } = useAuth();

  const isOwner = (userId, clubId) => {
    const club = userClubs.find((c) => c.id === clubId);
    if (!club) {
      return false;
    }
    return club.user_id === userId;
  };

  const isMember = (userId, clubId) => {
    const club = userClubs.find((c) => c.id === clubId);
    if (!club) {
      return false;
    }
    return club.user_id !== userId;
  };

  useEffect(() => {
    const loadUserClubs = async () => {
      try {
        const clubsResponse = await fetch(`${SERVER_API}/users/${state.user?.id}/clubs`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!clubsResponse.ok) {
          setUserClubs([]);
          return;
        }

        const clubsArray = await clubsResponse.json();
        setUserClubs(clubsArray);
      } catch (error) {
        setUserClubs([]);
      }
    };
    const loadClubs = async () => {
      if (!state.user?.id) {
        return;
      }

      try {
        const clubsResponse = await fetch(`${SERVER_API}/clubs`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!clubsResponse.ok) {
          setShowAlert(clubsResponse.message);
          setPending(false);
          return;
        }

        const clubsArray = await clubsResponse.json();

        setPending(false);
        setClubs(clubsArray);
      } catch (error) {
        setShowAlert(JSON.stringify(error));
        setPending(false);
      }
    };

    loadUserClubs();
    loadClubs();
  }, []);

  return (
    <>
      <div className="all-clubs-wrapper">
        <div className="top">
          <div className="left">
            <h2>All clubs</h2>
          </div>
        </div>

        {isPending ? (
          <Alert variant="light">Loading...</Alert>
        ) : !!showAlert ? (
          <Alert variant="danger">{showAlert}</Alert>
        ) : !clubs || (clubs && clubs.length === 0) ? (
          <Alert variant="light">There are no book clubs available yet.</Alert>
        ) : (
          <Row xs={1} sm={1} md={2} className="g-4">
            {clubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                isOwner={isOwner(state.user?.id, club.id)}
                isMember={isMember(state.user?.id, club.id)}
              />
            ))}
          </Row>
        )}
      </div>
      <JoinClubModal />
    </>
  );
};

export default ClubsList;
