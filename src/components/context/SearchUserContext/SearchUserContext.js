import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [loader, setLoader] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // Add this line

  const markDataAsFetched = () => {
    setDataFetched(true);
  };


  const payload = {
    allUsers,
    setAllUsers,
    filteredUsers,
    setFilteredUsers,
    loadingMap,
    setLoadingMap,
    loader,
    setLoader,
    isShown,
    setIsShown,
    markDataAsFetched,
    dataFetched,
    setDataFetched,
  };

  return (
    <SearchContext.Provider value={payload}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  return useContext(SearchContext);
};
