import React, { useState, useEffect } from 'react';
import { useContext } from 'react';

import Button from 'react-bootstrap/Button';

import Icon from '@mdi/react';
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDoubleLeft,
  mdiChevronDoubleRight,
  mdiDotsHorizontal,
} from '@mdi/js';

// import { DataContext } from '../contexts/DataContext';
import { BookListContext } from '../contexts/BookListContext';
import { PaginationContext } from '../contexts/PaginationContext';
import Stack from 'react-bootstrap/esm/Stack';
import Form from 'react-bootstrap/esm/Form';

const Pagination = () => {
  const { state, dataObject, error } = useContext(BookListContext);
  const { count } = dataObject;
  const { page, limit, changePage, showMax, contextFilter } = useContext(PaginationContext);

  const urlParams = new URLSearchParams(window.location.search);
  const [pagesNum, setPagesNum] = useState(1);
  const [pageLimit, setPageLimit] = useState(JSON.parse(urlParams.get('limit')));
  const [tempLimit, setTempLimit] = useState(JSON.parse(urlParams.get('limit')));
  const [url, changeUrl] = useState(window.location.href);

  const urlPage = JSON.parse(urlParams.get('page'));
  const urlLimit = JSON.parse(urlParams.get('limit'));
  const urlFilter = JSON.parse(urlParams.get('filter'));
  const urlSearch = JSON.parse(urlParams.get('search'));

  const handleChangeLimit = (value) => {
    if (value == tempLimit) return;
    setTempLimit(pageLimit);
    window.location.replace(
      `http://localhost:3001/library?page=1&limit=${pageLimit}&filter=%22${urlFilter}%22&search=%22${urlSearch}%22`
    );
  };

  useEffect(() => {
    setPagesNum(Math.ceil(count / limit));
  }, [dataObject]);

  function previousPage() {
    if (page > 1) {
      window.location.replace(
        `http://localhost:3001/library?page=${urlPage - 1}&limit=${urlLimit}&filter=%22${urlFilter}%22&search=%22${urlSearch}%22`
      );
      changePage(page - 1);
    }
  }
  function nextPage() {
    if (page < pagesNum) {
      window.location.replace(
        `http://localhost:3001/library?page=${urlPage + 1}&limit=${urlLimit}&filter=%22${urlFilter}%22&search=%22${urlSearch}%22`
      );
      changePage(page + 1);
    }
  }
  function firstPage() {
    if (page <= 1) return;
    window.location.replace(
      `http://localhost:3001/library?page=1&limit=${urlLimit}&filter=%22${urlFilter}%22&search=%22${urlSearch}%22`
    );
    changePage(1);
  }
  function lastPage() {
    if (page >= pagesNum) return;
    changePage(pagesNum);
    window.location.replace(
      `http://localhost:3001/library?page=${pagesNum}&limit=${urlLimit}&filter=%22${urlFilter}%22&search=%22${urlSearch}%22`
    );
  }

  function showPageNumber(index) {
    return (
      Math.abs(page - 1 - index) <= showMax ||
      (Math.abs(page - 1 - index) - showMax == 1 && (index == 0 || index == pagesNum - 1))
    );
  }

  function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  return (
    <>
      <div className="pagination">
        <Button
          variant="secondary"
          style={{ boxShadow: '0px 6px 8px 0px #80808040' }}
          onClick={() => {
            firstPage();
          }}
        >
          <Icon path={mdiChevronDoubleLeft} size={1} />
        </Button>
        <div style={{ width: '2px' }} />
        <Button
          variant="secondary"
          style={{ boxShadow: '0px 6px 8px 0px #80808040' }}
          onClick={() => {
            previousPage();
          }}
        >
          <Icon path={mdiChevronLeft} size={1} />
        </Button>
        <div style={{ width: '28px' }} />

        <div class="d-flex" style={{ width: '275px', justifyContent: 'center' }}>
          {/* show 1st page ? */}
          {Math.abs(page - 1) > showMax + 1 && (
            <>
              {/* hide pages that are far as dots */}
              <Button
                variant="secondary"
                style={{ boxShadow: '0px 6px 8px 0px #80808050' }}
                onClick={() => firstPage()}
              >
                {1}
              </Button>
              <div style={{ width: '2px' }} />
              {/* 1st page */}
              <Button variant="secondary" style={{ position: 'relative', boxShadow: '0px 6px 8px 0px #80808050' }}>
                <div style={{ visibility: 'hidden' }}>1</div>
                <Icon style={{ position: 'absolute', top: 11, left: 8.315 }} path={mdiDotsHorizontal} size={0.75} />
              </Button>
              <div style={{ width: '2px' }} />
            </>
          )}

          {/* highlight current page  and  show pages in x distance to current page*/}
          {Array.from({ length: pagesNum }, (_, index) => (
            <>
              {showPageNumber(index) && page == index + 1 && (
                <Button variant="primary" style={{ boxShadow: '0px 8px 10px 0px #808080e0' }}>
                  {index + 1}
                </Button>
              )}
              {showPageNumber(index) && page != index + 1 && (
                <Button
                  variant="secondary"
                  style={{ boxShadow: '0px 6px 8px 0px #80808050' }}
                  onClick={() => {
                    window.location.replace(
                      `http://localhost:3001/library?page=${index + 1}&limit=${urlLimit}&filter=%22${urlFilter}%22&search=%22${urlSearch}%22`
                    );
                    changeUrl(
                      `http://localhost:3001/library?page=${index + 1}&limit=${urlLimit}&filter=%22${urlFilter}%22&search=%22${urlSearch}%22`
                    );
                  }}
                >
                  {index + 1}
                </Button>
              )}
              {showPageNumber(index) && <div style={{ width: '2px' }} />}
            </>
          ))}

          {/* show last page ? */}
          {Math.abs(page - pagesNum) > showMax + 1 && (
            <>
              {/* hide pages that are far as dots */}
              <Button variant="secondary" style={{ position: 'relative', boxShadow: '0px 6px 8px 0px #80808050' }}>
                <div style={{ visibility: 'hidden' }}>1</div>
                <Icon style={{ position: 'absolute', top: 11, left: 8.315 }} path={mdiDotsHorizontal} size={0.75} />
              </Button>
              <div style={{ width: '2px' }} />
              {/* last page */}
              <Button variant="secondary" style={{ boxShadow: '0px 6px 8px 0px #80808050' }} onClick={() => lastPage()}>
                {pagesNum}
              </Button>
              <div style={{ width: '2px' }} />
            </>
          )}
        </div>

        <div style={{ width: '28px' }} />
        <Button variant="secondary" style={{ boxShadow: '0px 6px 8px 0px #80808040' }} onClick={() => nextPage()}>
          <Icon path={mdiChevronRight} size={1} />
        </Button>
        <div style={{ width: '2px' }} />
        <Button variant="secondary" style={{ boxShadow: '0px 6px 8px 0px #80808040' }} onClick={() => lastPage()}>
          <Icon path={mdiChevronDoubleRight} size={1} />
        </Button>
      </div>

      <div className="perPage" style={{ position: 'fixed', bottom: '130px', right: '10px', justifyItems: 'center' }}>
        <Stack direction="vertical" style={{ width: '80px', alignItems: 'center' }}>
          <div style={{ color: '#808080' }}>per page:</div>
          <div>
            <input
              style={{
                width: '50px',
                height: '40px',
                borderRadius: '6px',
                borderColor: '#80808080',
                borderWidth: 2,
                color: '#404040',
              }}
              value={pageLimit}
              onChange={(e) => setPageLimit(e.target.value > 1 ? e.target.value : 1)}
              onKeyUp={(e) => handleChangeLimit(e.target.value)}
              onClick={(e) => handleChangeLimit(e.target.value)}
              type="number"
              placeholder={10}
            />
          </div>
        </Stack>
      </div>
    </>
  );
};

export default Pagination;
