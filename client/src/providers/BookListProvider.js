import { useContext, useEffect, useState } from 'react';
import { BookListContext } from '../contexts/BookListContext';
import { PaginationContext } from '../contexts/PaginationContext';
import { SERVER_API } from '../constants/constants';

const BookListProvider = ({ children }) => {
  const { page, changePage, limit, changeLimit, contextFilter, contextSearch } = useContext(PaginationContext);

  const [dataObject, setDbData] = useState({
    state: 'ready',
    data: null,
  });

  console.log({ contextFilter, contextSearch });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = urlParams.get('page');
    const urlLimit = urlParams.get('limit');
    const urlFilter = urlParams.get('filter');
    const urlSearch = urlParams.get('search');

    console.log({ urlFilter: JSON.parse(urlFilter) });

    changePage(urlPage);
    changeLimit(urlLimit);

    setDbData((current) => ({ ...current, state: 'loading' }));
    fetch(
      `${SERVER_API}/book/list?page=${urlPage}&limit=${urlLimit}&filter="${JSON.parse(urlFilter)}"&search="${JSON.parse(urlSearch)}"`,
      {
        method: 'GET',
      }
    ).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setDbData({ state: 'error', error: responseJson.error });
      } else {
        setDbData({ state: 'ready', data: responseJson });
      }
    });
  }, [page, limit, contextFilter, contextSearch]);

  const value = {
    state: dataObject.state,
    dataObject: dataObject.data || [],
    error: dataObject.error || null,
  };

  return (
    <>
      <BookListContext.Provider value={value}>{children}</BookListContext.Provider>
    </>
  );
};

export default BookListProvider;
