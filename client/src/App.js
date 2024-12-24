import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import ClubPage from './pages/ClubPage';
import EventPage from './pages/EventPage';
import NotFound from './pages/NotFound';
import Events from './pages/Events';
import Library from './pages/library';
import BookDetail from './pages/bookDetail';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import { EventsProvider } from './contexts/EventsContext';
import { PaginationProvider } from './contexts/PaginationContext';
import BookListProvider from './providers/BookListProvider';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Styles
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/club/:id" element={<ClubPage />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route
              path="/events"
              element={
                <EventsProvider>
                  <Events />
                </EventsProvider>
              }
            />
            <Route
              path="/library"
              element={
                <PaginationProvider>
                  <BookListProvider>
                    <Library />
                  </BookListProvider>
                </PaginationProvider>
              }
            />
            <Route path="/book" element={<BookDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
