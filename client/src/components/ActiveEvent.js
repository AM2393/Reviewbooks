import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

const ActiveEvent = ({ event, showButton, showDeadline }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}.${month}.${year}`;
  };

  const navigate = useNavigate();

  const goTo = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div key={event?.id} className="event">
      <div className="image">
        <img src={event?.book_cover_url} />
      </div>
      <div className="metadata">
        <h3>{event?.book_title}</h3>
        <p className="author">
          <strong>{event?.author_name}</strong>
        </p>
        <p className="genre">
          <strong>Genre: </strong>
          {event?.genre_name}
        </p>
        <p className="description">
          <strong>Description: </strong>
          {event?.book_description}
        </p>
        {showDeadline && (
          <p className="deadline">
            <strong>Event deadline: {formatDate(event?.end_date)}</strong>
          </p>
        )}
      </div>
      {showButton && (
        <Button variant="primary" onClick={() => goTo(event?.event_id)}>
          Write review
        </Button>
      )}
    </div>
  );
};

export default ActiveEvent;
