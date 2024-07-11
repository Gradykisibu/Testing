import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Utilities from "../../../utilities";
import { getFirestore, getDocs, collection } from "firebase/firestore";

const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [postedFeed, setPostedFeed] = useState(false);
  const [getUsers, setGetUsers] = useState([]);
  const [loader, setLoader] = useState(false);

  const { getAllUsersFromFirestore } = Utilities();

  const markDataAsFetched = () => {
    setIsDataFetched(true);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchAllUsersFeeds = useCallback(async (options) => {
    const { setAlert } = options || {};
    setLoader(true);

    if (!isDataFetched) {
      const db = getFirestore();
      const usersCollection = collection(db, "feeds");

      try {
        const usersSnapshot = await getDocs(usersCollection);
        const fetchedFeeds = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffledFeeds = shuffleArray(fetchedFeeds);
        setFeeds(shuffledFeeds);
        markDataAsFetched();
      } catch (error) {
        console.error("Error fetching feeds:", error);
        setAlert({
          message: error.message,
          type: "error",
          duration: 5000,
          open: true,
        });
      } finally {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  }, [isDataFetched]);

  const fetchAllUsers = useCallback(async (options) => {
    const { setAlert } = options || {};
    try {
      const allUsers = await getAllUsersFromFirestore();
      setGetUsers(allUsers);
    } catch (error) {
      console.error("Error fetching all users:", error);
      setAlert({
        message: error.message,
        type: "error",
        duration: 5000,
        open: true,
      });
    }
  }, [getAllUsersFromFirestore]);

  useEffect(() => {
    if (postedFeed) {
      fetchAllUsers();
      fetchAllUsersFeeds();
    }
  }, [postedFeed, fetchAllUsers, fetchAllUsersFeeds]);

  const payload = {
    feeds,
    setFeeds,
    isDataFetched,
    markDataAsFetched,
    postedFeed,
    setPostedFeed,
    fetchAllUsers,
    fetchAllUsersFeeds,
    getUsers,
    loader,
  };

  return (
    <FeedContext.Provider value={payload}>{children}</FeedContext.Provider>
  );
};

export const useFeedContext = () => {
  return useContext(FeedContext);
};
