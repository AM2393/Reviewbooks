import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import GoogleButton from '../components/GoogleButton';

import { useAuth } from '../contexts/AuthContext';

// Constants
import { SERVER_API } from '../constants/constants';

const SigninPage = () => {
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);

  const navigate = useNavigate();
  const { handlerMap } = useAuth();

  const handleCloseAlert = () => setShowAlert(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(null);
    setIsPending(true);

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setValidated(true);

    if (!form.checkValidity()) {
      e.stopPropagation();
      setIsPending(false);
      return;
    }

    try {
      const response = await fetch(`${SERVER_API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password, remember: !!data.remember }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setShowAlert(responseData.message);
        setValidated(false);
        setIsPending(false);
        return;
      }

      // login successful
      handlerMap.setUser(responseData);
      navigate('/');
    } catch (error) {
      setShowAlert(JSON.stringify(error));
    }
    setIsPending(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleUser(codeResponse),
    onError: (error) => {
      setIsPending(false);
      setShowAlert(JSON.stringify(error));
    },
  });

  // Check for login status
  useEffect(() => {
    if (handlerMap.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate, handlerMap]);

  // load google profile
  useEffect(() => {
    if (googleUser) {
      setShowAlert(null);
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${googleUser.access_token}`,
          Accept: 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            setShowAlert(JSON.stringify(response));
            return;
          }
          return response.json(); // Parse JSON response
        })
        .then((data) => {
          setGoogleProfile(data); // Set profile data
        })
        .catch((error) => {
          setShowAlert(JSON.stringify(error)); // Handle errors
        });
    }
  }, [googleUser]);

  // login via google profile
  useEffect(() => {
    if (googleProfile) {
      const handleGoogleLogin = async () => {
        setIsPending(true);
        try {
          const response = await fetch(`${SERVER_API}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: googleProfile.email, password: googleProfile.id, remember: true }),
          });

          const responseData = await response.json();

          if (!response.ok) {
            setIsPending(false);
            setShowAlert(responseData.message);
            return;
          }

          // login successful
          handlerMap.setUser(responseData);
          navigate('/');
        } catch (error) {
          setShowAlert(JSON.stringify(error));
        }
        setIsPending(false);
      };

      handleGoogleLogin();
    }
  }, [googleProfile]);

  return (
    <>
      <Header />
      <Container className="entry">
        <h1 style={{ textAlign: 'center' }}>Sign in</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="signin-form">
          {isPending && (
            <div className="spinner-wrapper">
              <Spinner animation="border" variant="secondary" />
            </div>
          )}
          <GoogleButton text="Přihlášení přes Google" callback={googleLogin} />
          <div className="or-separator">
            <span>Or sign in with email</span>
          </div>
          <Form.Group className="mb-3" controlId="signinEmail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="email" name="email" defaultValue="" required />
            <Form.Control.Feedback type="invalid">Please enter a valid email</Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="signinPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" defaultValue="" required />
            <Form.Control.Feedback type="invalid">Please enter a password</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Zapamatovat si mě" name="remember" defaultChecked />
          </Form.Group>
          <Alert show={!!showAlert} variant="danger" dismissible onClose={handleCloseAlert}>
            <pre>{showAlert}</pre>
          </Alert>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button variant="primary" type="submit">
              Sign in
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default SigninPage;
