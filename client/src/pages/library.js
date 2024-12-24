import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useContext } from 'react';

// import { DataContext } from '../contexts/DataContext';
import { BookListContext } from '../contexts/BookListContext';
import { PaginationContext } from "../contexts/PaginationContext"

// Components
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import Stack from 'react-bootstrap/esm/Stack';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Pagination from '../components/pagination';
import Icon from '@mdi/react';
import { mdiCheck, mdiClose } from '@mdi/js';

import { AddEditBookButton } from '../components/AddEditBookButton'; // New import
import { BookFormModal } from '../components/BookFormModal';

const DataTest = () => {

  const { state, dataObject, error } = useContext(BookListContext);
  const { books, count } = dataObject
  const {
    page, limit,
    contextFilter, changeFilter,
    contextSearch, changeSearch,
    defaultLimit
  } = useContext(PaginationContext)

  const urlParams = new URLSearchParams(window.location.search)
  const [showFilter, setShowFilter] = useState(false)
  const [tempFilter, setTempFilter] = useState(JSON.parse(urlParams.get('filter')))
  const [filter, setFilter] = useState(JSON.parse(urlParams.get('filter')))
  const [tempSearch, setTemSearch] = useState()

  const [allGenres, setAllGenres] = useState([])
  const [displayObjects, setDisplayObjects] = useState([])

  const urlPage = JSON.parse(urlParams.get('page'));
  const urlLimit = JSON.parse(urlParams.get('limit'));
  const urlSearch = JSON.parse(urlParams.get('search'));

  useMemo(() => {

    let tempArray = []
    if (books) {
      for (let i = 0; i < limit; i++) {
        if (books[i]) {
          tempArray.push(books[i])
        }
      }
    }
    setDisplayObjects(tempArray)
  }, [books, page, limit])

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/book/getAllGenres`, {
      method: 'GET'
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
      } else {
        setAllGenres(responseJson);
      }
    });
  },[])

  return (
    <>
      <Header />
      <Container style={{ justifyItems: "center" }}>

        {/* <div style={{ height: "72px" }} /> */}
        <div style={{ height: "96px" }} />

        {/*  */}
        <div style={{
          position: "absolute", top: "50px", left: "0px", zIndex: 50,
          backgroundColor: "#ffffff"
        }}>
          <div style={{ width: "100%", position: "fixed" }}>
            <Card>
              <div style={{position: "fixed", width: "100%"}}>
                <h2 className='libraryTitle' libraryTitle>Library</h2>
              </div>
            <Card.Body>
                <Stack direction="horizontal">

                  {/* filter */}
                  <div style={{ position: "relative", paddingRight: "10px" }}>
                    <ButtonGroup>
                      <Button
                        style={{ position: "relative", width: "80px" }}
                        onClick={() => setShowFilter(!showFilter)}
                      >Filter</Button>
                      <Button disabled={true} variant='light' style={{ width: "160px" }}>
                        {filter}
                      </Button>
                    </ButtonGroup>

                    {showFilter && <Stack direction="vertical" gap={1}
                      style={{ zIndex: 20, position: "absolute", left: 0, top: 43, width: "220px" }}
                    >
                      <ButtonGroup vertical>
                        {allGenres.map((genre) =>
                          <Button
                          variant={`${(tempFilter == `${genre}`) ? "primary" : "secondary"}`}
                          onClick={() => setTempFilter(
                            `${(tempFilter == `${genre}`) ? "None" : `${genre}`}`
                          )}
                        >
                          <Stack direction="horizontal">
                            {`${genre}`}
                          </Stack>
                        </Button>
                        )}
                      </ButtonGroup>
                      <Button onClick={() => {
                        changeFilter(tempFilter)
                        setShowFilter(false)
                        window.location.replace(`http://localhost:3001/library?page=1&limit=${defaultLimit}&filter=%22${tempFilter}%22&search=%22${urlSearch}%22`)
                      }}
                      >
                        Confirm
                      </Button>
                    </Stack>}

                  </div>

                  {/* search */}
                  <div className='ms-auto' style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1000 }}>
                    <ButtonGroup>
                      <Form.Control
                        type="text"
                        placeholder= "Search books"
                        onKeyUp={(e) => setTemSearch(e.target.value)}
                      />
                      <Button
                        style={{ width: "80px" }}
                        onClick={() => {
                          changeSearch((tempSearch) ? "" : tempSearch)
                          if(tempSearch) {
                            window.location.replace(`http://localhost:3001/library?page=1&limit=${defaultLimit}&filter=%22${tempFilter}%22&search=%22${tempSearch}%22`)
                          } else {
                            window.location.replace(`http://localhost:3001/library?page=1&limit=${defaultLimit}&filter=%22${tempFilter}%22&search=%22%22`)
                          }
                        }}
                      >
                        Search
                      </Button>
                    </ButtonGroup>
                    <AddEditBookButton 
                      buttonText="+ Add book" 
                      mode="add" 
                      style={{ 
                        marginLeft: '10px',
                        position: 'relative',
                        zIndex: 1000 
                      }}
                    />
                  </div>

                </Stack>

                {urlSearch != "" && <Stack style={{paddingTop: "16px"}}>
                  <ButtonGroup className='ms-auto'>
                    <Button disabled={true} variant='light' style={{alignContent: "start"}}>
                      searching for: {urlSearch}
                    </Button>
                    <Button variant='light'
                    onClick={() => window.location.replace(`http://localhost:3001/library?page=1&limit=${defaultLimit}&filter=%22${tempFilter}%22&search=%22%22`)}
                    >
                      <Icon path={mdiClose} size={0.85} color={"#714300"} style={{paddingBottom: "2px"}}/>
                    </Button>
                  </ButtonGroup>
                </Stack>}

              </Card.Body>
            </Card>

          </div>
        </div>

        {showFilter && <div className='spaceButton'
          onClick={() => {
            setShowFilter(false)
            setTempFilter(false)
          }}
        />}


        <div style={{ height: "40px" }} />
        {urlSearch != "" && <div style={{ height: "56px" }} />}

        <div className='libraryContainer'>
          <Row className='centerLibrary' style={{justifySelf: "center"}}>
            {displayObjects && displayObjects.map(({ id, title, isbn, cover_url, author, description }) =>
              <div style={{ width: '18rem', margin: '2rem' }}>
                <Card style={{ boxShadow: "0px 10px 22px -10px #80808080" }}>
                  <Button href={`/book?id=${id}`}
                    variant='light'
                    style={{ borderColor: "#ffffff00" }}
                  >
                    <Card.Img variant="top" src={cover_url} />
                    <Card.Body>
                      <Card.Title>{title}</Card.Title>
                      <Card.Text>
                        Author: {author} <br />
                      </Card.Text>
                    </Card.Body>
                  </Button>
                </Card>
              </div>
            )}
          </Row>
        </div>

          {displayObjects.length == 0 && <div style={{width: "100vw", height: "75vh", justifyItems: "center", alignContent: "center"}}>
            <div style={{color: "#714300", fontSize: "40px", fontFamily: "sans-serif", fontWeight: 600,
              paddingBottom: "20vh"
            }}>no books found</div>
          </div>}

        <div style={{ height: "150px" }} />

      </Container>

      <Pagination/>

      <div style={{position: "fixed", bottom: "0", width: "100%"}}>
        <Footer/>
      </div>
    </>
  )
};

export default DataTest;

