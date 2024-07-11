import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthContext } from "../context/AuthContext/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Triangle } from "react-loader-spinner";
import { useSearchContext } from "../context/SearchUserContext/SearchUserContext";

function Search() {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const auth = getAuth();
  const db = getFirestore();
  const uid = auth?.currentUser?.uid;
  const displayedUserId = user?.uid;

  const {
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
  } = useSearchContext();

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  console.log(windowSize)


  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchAllUsers = useCallback(async () => {
    setLoader(true);
    const db = getFirestore();
    const usersCollection = collection(db, "users");
    try {
      const usersSnapshot = await getDocs(usersCollection);

      const allUsersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllUsers(allUsersData);
      setLoader(false);
      markDataAsFetched();
    } catch (error) {
      console.error("Error fetching all users:", error);
      setLoader(false);
    }
  }, [setLoader, markDataAsFetched, setAllUsers]);

  useEffect(() => {
    fetchAllUsers()
  },[fetchAllUsers])
  
  useEffect(() => {
    if (!dataFetched) {
      fetchAllUsers();
      setDataFetched(true);
    }

    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [
    name,
    allUsers,
    dataFetched,
    setDataFetched,
    setFilteredUsers,
    fetchAllUsers,
  ]);

  const handleFollowUser = async (user) => {
    console.log("clicked", user);
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [user.id]: true,
    }));

    try {
      const clickedUserDocRef = doc(db, "users", user.uid);
      const clickedUserDoc = await getDoc(clickedUserDocRef);

      if (clickedUserDoc.exists()) {
        const clickedUserData = clickedUserDoc.data();
        const updatedClickedUserData = {
          ...clickedUserData,
          followedUsers: [...(clickedUserData.followedUsers || []), uid],
        };

        await setDoc(clickedUserDocRef, updatedClickedUserData);
        setAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id
              ? { ...u, followedUsers: updatedClickedUserData.followedUsers }
              : u
          )
        );
      } else {
        console.error("Clicked user document does not exist");
      }
    } catch (error) {
      console.error("Error updating clicked user profile: ", error);
    } finally {
      setLoadingMap((prevLoadingMap) => ({
        ...prevLoadingMap,
        [user.id]: false,
      }));
    }
  };

  const handleUnfollowUser = async (user) => {
    console.log("Unfollow clicked", user);

    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [user.id]: true,
    }));

    try {
      const unfollowedUserDocRef = doc(db, "users", user.uid);
      const unfollowedUserDoc = await getDoc(unfollowedUserDocRef);

      if (unfollowedUserDoc.exists()) {
        const unfollowedUserData = unfollowedUserDoc.data();
        const updatedUnfollowedUserData = {
          ...unfollowedUserData,
          followedUsers: unfollowedUserData.followedUsers.filter(
            (userId) => userId !== uid
          ),
        };

        await setDoc(unfollowedUserDocRef, updatedUnfollowedUserData);
        setAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === user.id
              ? { ...u, followedUsers: updatedUnfollowedUserData.followedUsers }
              : u
          )
        );
      } else {
        console.error("Unfollowed user document does not exist");
      }
    } catch (error) {
      console.error("Error updating unfollowed user profile: ", error);
    } finally {
      setLoadingMap((prevLoadingMap) => ({
        ...prevLoadingMap,
        [user.id]: false,
      }));
    }
  };

  return (
    <Box sx={searchMainContainer}>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: { xs: "block", sm: "block", md: "none", lg: "none" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            color: "white",
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://www.logomaker.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kh...CCrhNMmBfFwXs1M3EMoAJtlyAthvFv...foz"
            alt="logo"
            width={150}
            height={100}
          />
          <p style={{ mt: "10px" }}>
            cannot display on this device, switch to desktop size
          </p>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: { xs: "none", sm: "none", md: "block", lg: "block" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            // height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection:"column",
          }}
        >
          <input
            type="text"
            placeholder="Search available user"
            onChange={handleChange}
            style={{
              width: "60%",
              height: "50px",
              background: "#0A0A0A",
              color: "white",
              borderRadius: "10px",
              paddingLeft: "6px",
              border: "1px solid #1e1e1e",
            }}
          />

        <Box
          sx={{
            width: "100%",
            // height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: "30px",
            background: "#101010",
          }}
        >
          {!loader ? (
            <>
              {filteredUsers
                .filter((filteredUser) => filteredUser.id !== user?.uid)
                .map((user) => (
                  <Box
                    key={user.id}
                    sx={{
                      borderBottom: "1px solid #777777",
                      width: "60%",
                      marginTop: "10px",
                      height: "70px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                        width: "270px",
                      }}
                    >
                      <Box sx={{ marginRight: "50px" }}>
                        {user?.image && (
                          <img
                            src={user?.image}
                            alt=""
                            width={50}
                            height={50}
                            style={{ borderRadius: "50%" }}
                          />
                        )}

                        {!user?.image && (
                          <AccountCircleIcon
                            sx={{ width: "50px", height: "50px" }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          lineHeight: "7px",
                          color: "white",
                          width: "200px",
                        }}
                      >
                        <Link
                          to={"/user/" + user?.id}
                          style={{
                            textDecoration: isShown[user.id]
                              ? "underline"
                              : "none",
                            color: "white",
                          }}
                          onMouseEnter={() =>
                            setIsShown((prev) => ({
                              ...prev,
                              [user.id]: true,
                            }))
                          }
                          onMouseLeave={() =>
                            setIsShown((prev) => ({
                              ...prev,
                              [user.id]: false,
                            }))
                          }
                        >
                          <p
                            style={{
                              textTransform: "uppercase",
                              fontSize: "13px",
                            }}
                          >
                            {user?.name}
                          </p>
                        </Link>
                        <p style={{ color: "#777777", fontSize: "11px" }}>
                          @{user?.initial}
                        </p>
                        <p style={{ fontSize: "11px", color: "#777777" }}>
                          <span style={{ marginRight: "5px" }}>
                            {user?.followedUsers
                              ? user.followedUsers.length
                              : 0}
                          </span>
                          <span>
                            {" "}
                            {user?.followedUsers?.length === 1
                              ? "Follower"
                              : "Followers"}
                          </span>
                        </p>
                      </Box>
                    </Box>

                    <Box sx={{ marginRight: "30px" }}>
                      <button
                        style={button}
                        onClick={async () => {
                          if (
                            user?.followedUsers
                              ? user.followedUsers.includes(displayedUserId)
                              : false
                          ) {
                            // If already following, unfollow
                            await handleUnfollowUser(user);
                          } else {
                            // If not following, follow
                            const isFollowing = await handleFollowUser(user);
                            if (isFollowing) {
                              console.log("Now following the user");
                            } else {
                              console.log(
                                "Error or already following the user"
                              );
                            }
                          }
                        }}
                      >
                        {loadingMap[user.id] ? (
                          <CircularProgress
                            size={20}
                            style={{ color: "grey" }}
                          />
                        ) : (
                          <>
                            {user?.followedUsers
                              ? user.followedUsers.includes(displayedUserId)
                                ? "unfollow"
                                : "follow"
                              : "follow"}
                          </>
                        )}
                      </button>
                    </Box>
                  </Box>
                ))}
            </>
          ) : (
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          )}
        </Box>
        </Box>

      </Box>
    </Box>
  );
}

export default Search;

const button = {
  border: "1px solid grey",
  background: "#1e1e1e",
  color: "white",
  width: "200px",
  height: "40px",
  borderRadius: "10px",
  cursor: "pointer",
};

const searchMainContainer = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  background: "#101010",
  marginTop: "120px",
};
