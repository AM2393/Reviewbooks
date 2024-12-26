/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import GoogleButton from '../components/GoogleButton';

import { useAuth } from '../contexts/AuthContext';

// Constants
import { SERVER_API } from '../constants/constants';

const SignupPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setValidated(true);
    if (!form.checkValidity() || password !== confirmPassword) {
      e.stopPropagation();
      return;
    }

    setIsPending(true);

    const newUser = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch(`${SERVER_API}/users`, {
        method: 'POST',
        headers: { 'Access-Control-Allow-Origin':' *','Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newUser),
      });

      const responseJson = await response.json();

      if (response.status < 400) {
        setIsPending(false);
        handlerMap.setUser(responseJson);
        navigate('/');
        return;
      }

      if (responseJson.status >= 400) {
        setShowAlert(`Error ${responseJson.status}: ${responseJson.message}`);
        setIsPending(false);
        setValidated(false);
        return;
      }
    } catch (error) {
      setShowAlert(error.message);
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

  // register via google profile
  useEffect(() => {
    if (googleProfile) {
      setValidated(false);
      const handleGoogleRegistration = async () => {
        setIsPending(true);
        const newUser = {
          first_name: googleProfile.given_name,
          last_name: googleProfile.family_name,
          email: googleProfile.email,
          password: googleProfile.id,
        };

        try {
          const response = await fetch(`${SERVER_API}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(newUser),
          });

          const responseJson = await response.json();

          if (response.status < 400) {
            setIsPending(false);
            handlerMap.setUser(responseJson);
            navigate('/');
            return;
          }

          if (responseJson.status >= 400) {
            setShowAlert(`Error ${responseJson.status}: ${responseJson.message}`);
            setIsPending(false);
            return;
          }
        } catch (error) {
          setShowAlert(error.message);
        }

        setIsPending(false);
      };

      handleGoogleRegistration();
    }
  }, [googleProfile]);

  return (
    <>
      <Header />
      <Container className="entry">
        <h1 style={{ textAlign: 'center' }}>Sign up</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="signup-form">
          {isPending && (
            <div className="spinner-wrapper">
              <Spinner animation="border" variant="secondary" />
            </div>
          )}
          <GoogleButton text="Registrace přes Google" callback={googleLogin} />
          <div className="or-separator">
            <span>Or sign up with email</span>
          </div>
          <Form.Group className="mb-3" controlId="signupFirstname">
            <Form.Label>Jméno</Form.Label>
            <Form.Control type="text" name="first_name" defaultValue="" required />
            <Form.Control.Feedback type="invalid">Please enter a firstname</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupLastname">
            <Form.Label>Příjmení</Form.Label>
            <Form.Control type="text" name="last_name" defaultValue="" required />
            <Form.Control.Feedback type="invalid">Please enter a lastname</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupEmail">
            <Form.Label>E-mail</Form.Label>
            <Form.Control type="email" name="email" defaultValue="" required />
            <Form.Control.Feedback type="invalid">Please enter a valid email</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              defaultValue=""
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">Please enter a password</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupPasswordAgain">
            <Form.Label>Password again</Form.Label>
            <Form.Control
              type="password"
              name="passwordAgain"
              defaultValue=""
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={validated && password !== confirmPassword}
              required
            />
            <Form.Control.Feedback type="invalid">Passwords do not match.</Form.Control.Feedback>
          </Form.Group>
          <Alert show={!!showAlert} variant="danger" dismissible onClose={handleCloseAlert}>
            <pre>{showAlert}</pre>
          </Alert>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button variant="primary" type="submit">
              Sign up
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default SignupPage;
