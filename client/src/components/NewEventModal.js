import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SERVER_API } from '../constants/constants';
import { useParams } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function NewEventModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [isPending, setPending] = useState(false);

  const [bookError, setBookError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [startDateError, setStartDateError] = useState(false);
  const [endDateError, setEndDateError] = useState(false);

  const [allBooks, setBooks] = useState([]);
  const { id: clubId } = useParams();

  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    setPending(true);
    try {
      const response = await fetch(`${SERVER_API}/book/listAllBooks`);
      const books = await response.json();
      setBooks(books);
      setPending(false);
      return;
    } catch (err) {
      setShowAlert(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(null);
    setPending(true);

    const form = document.querySelector('#form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.book_id == '') {
      setBookError(true);
    } else {
      setBookError(false);
    }

    if (data.description == '') {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }

    if (data.start_date == '') {
      setStartDateError(true);
    } else {
      setStartDateError(false);
    }

    if (data.end_date == '') {
      setEndDateError(true);
    } else {
      setEndDateError(false);
    }

    if (!form.checkValidity()) {
      e.stopPropagation();
      setPending(false);
      return;
    }

    setValidated(true);

    const newStartDate = `${data.start_date}T00:00:00.00Z`;
    const newEndDate = `${data.end_date}T00:00:00.00Z`;

    const createClubEvent = await fetch(`${SERVER_API}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...data, club_id: clubId, start_date: newStartDate, end_date: newEndDate }),
    });

    if (createClubEvent) {
      setPending(false);
      closeModal();
      const newEvent = await createClubEvent.json();
      navigate(`/event/${newEvent.id}`);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={openModal}>
        Create Event
      </Button>
      {isModalOpen && (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
          <div className={`modal-content ${isClosing ? 'closing' : ''}`}>
            <h3 className="center">Create new event</h3>
            <Form noValidate validated={validated} id="form" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="createEvent.book">
                <Form.Label>Book</Form.Label>
                <Form.Select required name="book_id" isInvalid={bookError}>
                  <option value={''}>Select a book</option>
                  {allBooks.map((book) => (
                    <option key={book.id} value={`${book.id}`}>
                      {book.title}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">Please enter a book name</Form.Control.Feedback>
              </Form.Group>
              <div className=" mb-3">
                Can't find the book?{' '}
                <Link
                  to="/library"
                  style={{
                    color: '#007bff',
                    textDecoration: 'none',
                  }}
                >
                  Add it to your library
                </Link>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Event description</Form.Label>
                <Form.Control as="textarea" rows={3} required name="description" isInvalid={descriptionError} />
                <Form.Control.Feedback type="invalid">Please enter an event description</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="createEvent.dates">
                <Form.Label>Event Dates</Form.Label>
                <div className="d-flex justify-content-between">
                  <div style={{ width: '48%' }}>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Start Date"
                      className={`form-control ${startDateError ? 'is-invalid' : ''}`}
                      dateFormat="yyyy-MM-dd"
                      required
                      name="start_date"
                    />
                    {startDateError && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                        Please select a valid date.
                      </Form.Control.Feedback>
                    )}
                  </div>
                  <div style={{ width: '48%' }}>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="End Date"
                      className={`form-control ${endDateError ? 'is-invalid' : ''}`}
                      dateFormat="yyyy-MM-dd"
                      required
                      name="end_date"
                    />
                    {endDateError && (
                      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                        Please select a valid date.
                      </Form.Control.Feedback>
                    )}
                  </div>
                </div>
              </Form.Group>
              <div className="modal-buttons">
                <Button variant="primary" type="submit">
                  Confirm
                </Button>
                <Button variant="light" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
