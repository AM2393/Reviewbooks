import React, { createContext, useState } from 'react';

export const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
    const [page, setPage] = useState(1) // init library page
    const [limit, setLimit] = useState(3) // limit number of documents on one page
    const [showMax, setShowMax] = useState(2) // show page numbers in x distance to current page (in pagination component)
    const defaultLimit = 10
    
    const [contextFilter, setContextFilter] = useState("None")
    const [contextSearch, setContextSearch] = useState("")

    const changePage = (newPage) => {
        setPage(newPage)
    }
    const changeLimit = (newLimit) => {
        setLimit(newLimit)
    }

    const changeFilter = (newFilter) => {
        setContextFilter(newFilter)
    }
    const changeSearch = (newSearch) => {
        setContextSearch(newSearch)
    }

    const value = { 
        page, changePage,
        limit, changeLimit,
        showMax,
        contextFilter, changeFilter,
        contextSearch, changeSearch,
        defaultLimit
     };

    return <PaginationContext.Provider value={value}>{children}</PaginationContext.Provider>;
};