import React from 'react';

import Button from 'react-bootstrap/Button';

const Intro = () => {
  return (
    <div id="home-intro">
      <h1 className="display-3">OpenPage</h1>
      <p className="lead">
        Join our Book Clubs app to connect with fellow book lovers, discover new reads, and build communities.
      </p>

      <div>
        <Button variant="primary" size="lg" href="/signin">
          Sign in
        </Button>
        <Button variant="light" size="lg" href="/signup">
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default Intro;
