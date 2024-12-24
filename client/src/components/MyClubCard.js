import React from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

const MyClubCard = ({ club }) => {
  return (
    <Link to={`/club/${club.id}`}>
      <Card className="my-club">
        <Card.Body>
          <Card.Body>
            <h5>{club.name}</h5>
          </Card.Body>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default MyClubCard;
