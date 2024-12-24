import React from 'react';

import Container from 'react-bootstrap/Container';

const Footer = () => {
  return (
    <footer>
      <Container>
        <p>&copy; {new Date().getFullYear()} OpenPage - All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
