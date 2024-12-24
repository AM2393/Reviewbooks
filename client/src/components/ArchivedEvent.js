import React from 'react';

const ArchivedEvent = ({ event }) => {
  return (
    <div key={event.id} className="event">
      <div className="image">
        <img src={event.book_cover_url} />
      </div>
      <div className="metadata">
        <h5>{event.book_title}</h5>
      </div>
    </div>
  );
};

export default ArchivedEvent;
