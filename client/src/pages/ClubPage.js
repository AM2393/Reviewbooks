import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClubSettings from '../components/ClubSettings';
import ActiveEvent from '../components/ActiveEvent';
import ArchivedEvent from '../components/ArchivedEvent';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { SERVER_API } from '../constants/constants';
import CreateEventModal from '../components/CreateEventModal';
import NewEventModal from '../components/NewEventModal';

import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';

const ClubPage = () => {
  const [club, setClub] = useState(null);
  const [activeEvents, setActiveEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [isPending, setPending] = useState(true);
  const { id } = useParams();
  const { state } = useAuth();
  const { modalMap } = useModal();

  const getActiveEvents = (events) => {
    const now = new Date();
    return events.filter((event) => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      return now >= startDate && now <= endDate;
    });
  };

  const getArchivedEvents = (events) => {
    const now = new Date();
    return events.filter((event) => new Date(event.end_date) < now);
  };

  const isModerator = () => club?.user_id === state.user?.id;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsResponse = await fetch(`${SERVER_API}/events/club/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!eventsResponse.ok) {
          return;
        }

        const events = await eventsResponse.json();
        const active = getActiveEvents(events);
        const archived = getArchivedEvents(events);

        setActiveEvents(active);
        setArchivedEvents(archived);
      } catch (error) {
        //todo: handle error
      }
    };
    const loadClub = async () => {
      try {
        const clubResponse = await fetch(`${SERVER_API}/clubs/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!clubResponse.ok) {
          return;
        }

        const clubData = await clubResponse.json();
        setClub(clubData);
        setPending(false);
      } catch (error) {
        //todo: handle error
      }
    };

    loadEvents();
    loadClub();
  }, []);
  return (
    <>
      <Header />
      <Container className="entry">
        {isPending && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
        <div className="club-top">
          <div className="heading">
            <h1>{club?.name}</h1>
            <p>{club?.description}</p>
          </div>
          <ClubSettings isModerator={isModerator} club={club} />
        </div>
        <Card className="events-wrapper">
          <div className="top">
            <h2>Ongoing events</h2>
            {isModerator() && (
              <>
                <NewEventModal />
              </>
            )}
            {isModerator() && <CreateEventModal club={club} />}
          </div>
          <div className="active-events-wrapper">
            {activeEvents.map((event, index) => (
              <ActiveEvent event={event} key={index} showButton={true} showDeadline={true} />
            ))}
            {activeEvents.length === 0 && <Alert variant="dark">There are no events at this moment</Alert>}
          </div>
        </Card>
        <Card className="events-wrapper">
          <div className="top">
            <h2>Archived events</h2>
          </div>
          <div>
            <div className="archived-events-wrapper">
              {archivedEvents.length > 0 &&
                archivedEvents.map((event, index) => <ArchivedEvent event={event} key={index} />)}
            </div>
            {archivedEvents.length === 0 && <Alert variant="dark">There are no archived events</Alert>}
          </div>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default ClubPage;
