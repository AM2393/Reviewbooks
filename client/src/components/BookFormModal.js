import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { SERVER, SERVER_API } from '../constants/constants';

export function BookFormModal({ buttonText, mode = 'add', initialData = null, show, onHide, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author: '',
    genre: '',
    description: '',
    cover_url: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      isbn: '',
      author: '',
      genre: '',
      description: '',
      cover_url: '',
    });
    setErrors({});
  };

  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [genreSuggestions, setGenreSuggestions] = useState([]);
  const authorInputRef = useRef(null);
  const genreInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      resetForm();
    }
  }, [initialData, show]);

  useEffect(() => {
    // Fetch authors
    fetch(`${SERVER_API}/authors`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setAuthors(data))
      .catch((error) => {
        console.error('Error fetching authors:', error);
        setErrors((prev) => ({ ...prev, fetchAuthors: 'Failed to load authors' }));
      });

    // Fetch genres
    fetch(`${SERVER_API}/genres`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setErrors((prev) => ({ ...prev, fetchGenres: 'Failed to load genres' }));
      });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.isbn?.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.author?.trim()) newErrors.author = 'Author is required';
    if (!formData.genre?.trim()) newErrors.genre = 'Genre is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const url = mode === 'add' ? `${SERVER_API}/book/create` : `${SERVER_API}/book/update?id=${initialData.id}`;

        const method = mode === 'add' ? 'POST' : 'PUT';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          resetForm();
          onHide();
          if (onSubmitSuccess) {
            onSubmitSuccess(formData);
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to ${mode === 'add' ? 'add' : 'update'} book`);
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, submit: error.message }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'author') {
      const filtered = authors.filter((author) => author.full_name.toLowerCase().includes(value.toLowerCase()));
      setAuthorSuggestions(filtered);
    } else if (name === 'genre') {
      const filtered = genres.filter((genre) => genre.name.toLowerCase().includes(value.toLowerCase()));
      setGenreSuggestions(filtered);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'add' ? 'Add New Book' : 'Edit Book'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              isInvalid={!!errors.isbn}
            />
            <Form.Control.Feedback type="invalid">{errors.isbn}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" ref={authorInputRef}>
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              isInvalid={!!errors.author}
            />
            <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
            {authorSuggestions.length > 0 && (
              <ListGroup className="position-absolute w-100">
                {authorSuggestions.map((author) => (
                  <ListGroup.Item
                    key={author.id}
                    action
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, author: author.full_name }));
                      setAuthorSuggestions([]);
                    }}
                  >
                    {author.full_name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>

          <Form.Group className="mb-3" ref={genreInputRef}>
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              isInvalid={!!errors.genre}
            />
            <Form.Control.Feedback type="invalid">{errors.genre}</Form.Control.Feedback>
            {genreSuggestions.length > 0 && (
              <ListGroup className="position-absolute w-100">
                {genreSuggestions.map((genre) => (
                  <ListGroup.Item
                    key={genre.id}
                    action
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, genre: genre.name }));
                      setGenreSuggestions([]);
                    }}
                  >
                    {genre.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Book Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Book Cover URL</Form.Label>
            <Form.Control type="url" name="cover_url" value={formData.cover_url} onChange={handleInputChange} />
          </Form.Group>
        </Form>
        {errors.submit && <div className="alert alert-danger mt-3">{errors.submit}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit} style={{ backgroundColor: '#714300', borderColor: '#714300' }}>
          {mode === 'add' ? 'Add Book' : 'Save Changes'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            resetForm();
            onHide();
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
