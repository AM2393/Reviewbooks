import React, { useEffect, useState } from 'react';
import Stack from 'react-bootstrap/Stack'
import Icon from '@mdi/react';
import {
  mdiAccountCircle
} from '@mdi/js';

// Components
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookFormModal } from '../components/BookFormModal';

const BookDetail = () => {
  const [bookData, setBookData] = useState(null)
  const urlParams = new URLSearchParams(window.location.search)
  const urlID = urlParams.get('id');

  const [book, setBook] = useState({
    state: 'ready',
    data: null,
  });

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setBook((current) => ({ ...current, state: 'loading' }));
    fetch(`http://localhost:3000/api/v1/book/get?id=${urlID}`, {
      method: 'GET'
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setBook({ state: 'error', error: responseJson.error });
      } else {
        setBook({ state: 'ready', data: responseJson });
      }
    });
  }, []);

  useEffect(() => {
    setBookData(book.data)
  }, [book])

  const handleEditSubmit = (updatedData) => {
    setBookData(prev => ({
      ...prev,
      book: {
        ...prev.book,
        ...updatedData
      }
    }));
  };

  return (
    <>
      <Header />
      {bookData && <Container style={{ justifyItems: "center" }}>
        <div style={{ height: "92px" }} />

        <Stack direction="horizontal" style={{width: "100%", paddingBottom: "32px"}}>
          <h2 style={{textWrap: "nowrap", fontWeight: 650, color: "#714300"}}>{bookData.book.title}</h2>
          <div className="ms-auto">
            <Button variant='secondary' onClick={() => setShowEditModal(true)}>Edit</Button>
          </div>
        </Stack>
        
        <Card style={{width: "100%", backgroundColor: "#f2e4bc", boxShadow: "0px 8px 15px 0px #80808048"}}>
          <Stack direction="horizontal" gap={3} style={{margin: '2rem', width: "100%"}}>
            <Card.Img  variant="top" src={`${bookData.book.cover_url}`} style={{ width: "160px", height: "160px", borderRadius:"6px"}}/>
            <div className='bookDataContainer'>
                <Stack direction="vertical" gap={3} style={{marginInline: '0rem', textWrap: "nowrap", fontWeight: 500, color: "#714300"}}>
                  <div>ISBN: {bookData.book.isbn}</div>
                  <div>Author: {bookData.book.author}</div>
                  <div>Genre: {bookData.book.genre}</div>
                  <div>Description: {bookData.book.description}</div>
                </Stack>
            </div>
          </Stack>
        </Card>

        <div style={{paddingTop: "64px", paddingBottom: "16px", color: "#714300"}}>
          <h3>Reviews</h3>
        </div>

        <div className='bookReviewsContainer'>
          {bookData.reviews.map((e, i) => {
            let strDate = e.created_at
            strDate = strDate.replace("T", " ").replace("Z", "")
            strDate = strDate.slice(0, strDate.length - 4)

            return(
              <React.Fragment key={i}>
                <Card style={{position:"relative", boxShadow: "0px 3px 5px -1px #80808030"}}>
                  <Stack direction='horizontal' style={{paddingTop: "4px", paddingBottom: "4px"}}>
                    <div style={{position: "absolute", top: "4px", left: "4px", alignContent: "start"}}>
                      <Icon path={mdiAccountCircle} size={1.5} color={"#71430090"}/>
                    </div>
                    <div style={{paddingLeft: "46px", paddingTop: "5px"}}>
                      <Stack direction="vertical">
                        <div style={{paddingBottom: "6px"}}>
                          <Stack direction="horizontal">
                            <div style={{color: "#714300", fontWeight: 500}}>{e.first_name} {e.last_name}</div>
                            <div style={{width: "12px"}}/>
                            <div style={{color: "#808080", fontWeight: 500}}>{strDate}</div>
                          </Stack>
                        </div>
                        <div style={{color: "#000000"}}>{e.review}</div>
                      </Stack>
                    </div>
                  </Stack>
                </Card>
                <div style={{paddingBottom: "8px"}}/>
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ height: "150px" }} />

        <BookFormModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          mode="edit"
          initialData={bookData.book}
          onSubmitSuccess={handleEditSubmit}
        />
      </Container>}

      <Footer />
    </>
  )
};

export default BookDetail;

