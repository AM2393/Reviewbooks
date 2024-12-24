/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import MyClubCard from './MyClubCard';
import ClubModal from './ClubModal';

import { SERVER_API } from '../constants/constants';

import { useAuth } from '../contexts/AuthContext';

const MyClubsWrapper = () => {
  const [clubs, setClubs] = useState(null);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setPending] = useState(true);

  const { state } = useAuth();

  useEffect(() => {
    const loadClubs = async () => {
      if (!state.user?.id) {
        return;
      }

      try {
        const clubsResponse = await fetch(`${SERVER_API}/users/${state.user?.id}/clubs`, {
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

        setShowCreateClub(false);
        setPending(false);
        setClubs(clubsArray);
      } catch (error) {
        setShowAlert(JSON.stringify(error));
        setPending(false);
      }
    };

    loadClubs();
  }, [state.user?.id]);

  return (
    <div className="my-clubs-wrapper">
      <div className="top">
        <div className="left">
          <h2>My Clubs</h2>
          <Button variant="primary" onClick={() => setShowCreateClub(true)}>
            Create new club
          </Button>
        </div>
        <Link to="/events">
          Currently Reading <i className="bi bi-chevron-right"></i>
        </Link>
      </div>

      {isPending ? (
        <Alert variant="light">Loading...</Alert>
      ) : !!showAlert ? (
        <Alert variant="danger">{showAlert}</Alert>
      ) : !clubs || (clubs && clubs.length === 0) ? (
        <Alert variant="light">You're not member of any book club yet.</Alert>
      ) : (
        clubs.map((club) => <MyClubCard key={club.id} club={club} />)
      )}

      {showCreateClub && <ClubModal setShowCreateClub={setShowCreateClub} />}
    </div>
  );
};

export default MyClubsWrapper;
