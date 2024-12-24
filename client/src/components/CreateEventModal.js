/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useModal } from '../contexts/ModalContext';

import { SERVER_API } from '../constants/constants';

//import { SERVER_API } from '../constants/constants';

const CreateEventModal = ({ club }) => {
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setPending] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [book, setBook] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();

  const { isCreateEventOpen, modalMap } = useModal();

  const handleCloseAlert = () => setShowAlert(null);

  const handleInputChange = (event) => {
    setBookTitle(event.target.value);
    setQuery(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setBookTitle(suggestion.title);
    setBook(suggestion);
    setSuggestions([]);
    setQuery('');
  };

  const clearBook = () => {
    setBookTitle('');
    setBook(null);
  };

  const fetchBooks = async (searchQuery) => {
    setLoadingBooks(true);
    try {
      const response = await fetch(
        `${SERVER_API}/book/list?page=1&limit=1000000&filter=%22None%22&search=%22${searchQuery}%22`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) {
        throw new Error('Error fetching books');
      }
      const booksData = await response.json();
      setSuggestions(booksData.books);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== '') {
        fetchBooks(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(null);
    setPending(true);

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setValidated(true);

    if (!form.checkValidity() || !book) {
      e.stopPropagation();
      setPending(false);
      return;
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const requestData = {
      description: data.description,
      book_id: book?.id,
      club_id: club.id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };

    try {
      const response = await fetch(`${SERVER_API}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        setShowAlert('Event could not be updated');
        setValidated(false);
        setPending(false);
        return;
      }

      const createdEvent = await response.json();
      setPending(false);
      modalMap.closeCreateEvent();
      navigate(`/event/${createdEvent.id}`);
    } catch (error) {
      setShowAlert(JSON.stringify(error));
      setPending(false);
    }
  };

  return (
    <Modal show={isCreateEventOpen} onHide={() => modalMap.closeCreateEvent()} id="createEventModal">
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="form">
        {isPending && (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="createEvent.book" style={{ position: 'relative' }}>
            <Form.Label>Book</Form.Label>
            <Form.Control
              type="text"
              name="book"
              onChange={handleInputChange}
              value={bookTitle}
              disabled={!!book}
              style={{ marginBottom: '0.4rem' }}
              isInvalid={validated && !book}
            />
            {!!book && (
              <Button size="sm" variant="light" onClick={clearBook}>
                Remove book
              </Button>
            )}
            <div className="suggestions-wrapper">
              {loadingBooks && <Spinner animation="border" variant="secondary" size="sm" />}
              {suggestions.length > 0 &&
                suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="suggestion" onClick={() => handleSuggestionClick(suggestion)}>
                    <span className="title">{suggestion.title}</span>
                    <span className="author">{suggestion.author}</span>
                  </div>
                ))}
              {suggestions.length === 0 && !loadingBooks && <div className="book-not-found">No book found</div>}
            </div>
            <Form.Control.Feedback type="invalid">Please select a book.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="createEvent.description">
            <Form.Label>Event Description</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" required minLength={6} />
            <Form.Control.Feedback type="invalid">Please enter at least 6 characters description</Form.Control.Feedback>
          </Form.Group>
          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="createEvent.start">
                  <Form.Label>Start</Form.Label>
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="createEvent.end">
                  <Form.Label>End</Form.Label>
                  <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                </Form.Group>
              </Col>
            </Row>
          </Container>

          <Alert show={!!showAlert} variant="danger" dismissible onClose={handleCloseAlert}>
            <pre>{showAlert}</pre>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => modalMap.closeCreateEvent()}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Create Event
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;
