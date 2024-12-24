import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { googleLogout } from '@react-oauth/google';

import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { state, handlerMap } = useAuth();

  const expand = 'sm'; // use offcanvas for small screens

  const signinButtonHandler = () => {
    navigate('/signin');
  };

  const signupButtonHandler = () => {
    navigate('/signup');
  };

  const logoutButtonHandler = () => {
    googleLogout();
    handlerMap.logout();
  };

  return (
    <>
      <Navbar key={expand} expand={expand} className="header" fixed="top">
        <Container>
          <Navbar.Brand href="/" className="brand">
            OpenPage
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/" className="menuLink">
                  Home
                </Nav.Link>
                <Nav.Link href='/library?page=1&limit=10&filter="None"&search=""' className="menuLink">
                  Library
                </Nav.Link>
                {handlerMap.isLoggedIn() && state.loaded && (
                  <NavDropdown
                    title={state.user.first_name}
                    id={`offcanvasNavbarDropdown-expand-${expand}`}
                    align="end"
                  >
                    <NavDropdown.Item href="#action3">
                      <i className="bi bi-person-lines-fill"></i> Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutButtonHandler}>
                      <i className="bi bi-box-arrow-right"></i> Log out
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {!handlerMap.isLoggedIn() && state.loaded && (
                  <>
                    <Button variant="primary" onClick={signinButtonHandler}>
                      Sign in
                    </Button>
                    <Button variant="light" onClick={signupButtonHandler}>
                      Sign up
                    </Button>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
