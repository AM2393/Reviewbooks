import React, { useContext } from 'react';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import Container from 'react-bootstrap/Container';
import Intro from '../components/Intro';
import { useAuth } from '../contexts/AuthContext';
import { useEventsContext } from '../contexts/EventsContext.js';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

const Events = () => {
  const { state: authUser, handlerMap } = useAuth();
  const { state: eventState, eventsListObject } = useEventsContext();
  return (
    <>
      <Header />
      <Container className="entry">
        <h1>My Clubs / Currently being read</h1>
        {authUser.loaded && handlerMap.isLoggedIn() ? (
          <>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {eventsListObject.length > 0 ? (
                eventsListObject
                  .filter((group) => group.some((event) => new Date(event.end_date) > new Date()))
                  .map((events, groupIndex) =>
                    events
                      .filter((event) => new Date(event.end_date) > new Date())
                      .map((event, index) => (
                        <Card key={index}>
                          <Card.Img variant="top" src={event.book_cover_url} alt={`${event.book_title} cover`} />
                          <Card.Body>
                            <Card.Title>{event.book_title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{event.book_isbn}</Card.Subtitle>
                            <Card.Text>
                              <strong>Author:</strong> {event.author_name}
                              <br />
                              <strong>Genre:</strong> {event.genre_name}
                              <br />
                              <strong>Event deadline:</strong> {new Date(event.end_date).toLocaleString()}
                              <br />
                              <Link to={`/club/${event.club_id}`}>Look to club {event.club_name}</Link>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      ))
                  )
              ) : (
                <div>
                  <h3>No events found.</h3>
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <h3>loading</h3>
          </div>
        )}
        {authUser.loaded && !handlerMap.isLoggedIn() && (
          <>
            <Intro />
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Events;
