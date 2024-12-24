import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventSettings from '../components/EventSettings';
import ActiveEvent from '../components/ActiveEvent';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';

import { SERVER_API } from '../constants/constants';

import BookReview from "../components/BookReview.js"

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [isPending, setPending] = useState(true);
  const { id } = useParams();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const eventResponse = await fetch(`${SERVER_API}/events/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!eventResponse.ok) {
          return;
        }

        const eventData = await eventResponse.json();
        setEvent(eventData);
        setPending(false);
      } catch (error) {
        //todo: handle error
      }
    };

    loadEvent();
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
        <div className="event-top">
          <div className="heading">
            <h1>
              <a href={`/club/${event?.club_id}`}>{event?.club_name}</a> <span>/ {event?.book_title}</span>
            </h1>
            <p>{event?.event_description}</p>
          </div>
          <EventSettings event={event} />
        </div>
        <div className="period">
          <div className="start">
            <p>Start:</p>
            <p>{formatDate(event?.start_date)}</p>
          </div>
          <div className="end">
            <p>End:</p>
            <p>{formatDate(event?.end_date)}</p>
          </div>
        </div>
        <Card className="events-wrapper">
          <div className="top">
            <h2>Book</h2>
          </div>
          <div className="active-events-wrapper">
            <ActiveEvent event={event} showButton={false} showDeadline={false} />
          </div>
        </Card>

        {event && <BookReview props={{
          eventId: event.event_id,
          bookId: event.book_id
        }}/>}

      </Container>
      <Footer />
    </>
  );
};

export default EventPage;
