import React from 'react';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import Container from 'react-bootstrap/Container';
import Intro from '../components/Intro';
import Welcome from '../components/Welcome';
import MyClubsWrapper from '../components/MyClubsWrapper';
import ClubsList from '../components/ClubsList';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { state, handlerMap } = useAuth();
  return (
    <>
      <Header />
      <Container className="entry">
        {state.loaded && handlerMap.isLoggedIn() && (
          <>
            <Welcome />
            <MyClubsWrapper />
            <ClubsList />
          </>
        )}
        {state.loaded && !handlerMap.isLoggedIn() && (
          <>
            <Intro />
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Home;
