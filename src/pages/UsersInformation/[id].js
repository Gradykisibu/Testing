import React, { useState, useEffect } from "react";
import styles from "./userinfor.module.css";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import GroupsIcon from "@mui/icons-material/Groups";
import BasicTabs from "../../components/common/Tabs/Tabs";
import Stack from "@mui/material/Stack";
import { CircularProgress } from "@mui/material";
import { useAuthContext } from "../../components/context/AuthContext/AuthContext";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

function UsersInformation() {
  const { userId } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuthContext();
  console.log("userrrr", user);
  console.log(isFollowing)

  const db = getFirestore();

  const fetchAllUsers = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, "users");
    try {
      const usersSnapshot = await getDocs(usersCollection);

      const allUsersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllUsers(allUsersData);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const foundUser = allUsers.find((user) => user.id === userId);
    if (foundUser) {
      setUserInfo(foundUser);
      setIsFollowing(
        foundUser?.followedUsers && foundUser.followedUsers.includes(user?.uid)
      );
    } else {
      setUserInfo(null);
    }
  }, [allUsers, userId, user?.uid]);

  const handleFollowUser = async (clickedUser) => {
    setLoading(true);

    try {
      // Fetching the existing user data of the user being clicked
      const clickedUserDocRef = doc(db, "users", clickedUser.id);
      const clickedUserDoc = await getDoc(clickedUserDocRef);

      if (clickedUserDoc.exists()) {
        const clickedUserData = clickedUserDoc.data();

        // Update the clicked user's data by appending the current user to their followedUsers
        const updatedClickedUserData = {
          ...clickedUserData,
          followedUsers: [...(clickedUserData.followedUsers || []), user?.uid],
        };

        // Update Firestore document of the clicked user with the updated data
        await setDoc(clickedUserDocRef, updatedClickedUserData);

        // Update the local state
        fetchAllUsers();
        setIsFollowing(true);
      } else {
        console.error("Clicked user document does not exist");
      }
    } catch (error) {
      console.error("Error updating clicked user profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowUser = async (clickedUser) => {
    setLoading(true);

    try {
      // Fetching the existing user data of the user being clicked
      const clickedUserDocRef = doc(db, "users", clickedUser.id);
      const clickedUserDoc = await getDoc(clickedUserDocRef);

      if (clickedUserDoc.exists()) {
        const clickedUserData = clickedUserDoc.data();

        // Update the clicked user's data by removing the current user from their followedUsers
        const updatedClickedUserData = {
          ...clickedUserData,
          followedUsers: clickedUserData.followedUsers.filter(
            (id) => id !== user?.uid
          ),
        };

        // Update Firestore document of the clicked user with the updated data
        await setDoc(clickedUserDocRef, updatedClickedUserData);

        // Update the local state
        fetchAllUsers();
        setIsFollowing(false);
      } else {
        console.error("Clicked user document does not exist");
      }
    } catch (error) {
      console.error("Error updating clicked user profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box className={styles.profileMainContainer}>
        <Box className={styles.titles}>
          <Box className={styles.userName}>
            <h3 style={{ marginBottom: "-10px" }}>{userInfo?.name}</h3>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "#777777" }}>
                {userInfo?.initial ? userInfo.initial : "cloudmix user"}
              </p>
              <p className={styles.cloudMixNet}>cloudMix.net</p>
            </Box>
          </Box>
          <Box>
            <Stack direction="row" spacing={2}>
              <Avatar
                alt="G"
                src={userInfo?.image}
                sx={{ width: 80, height: 80 }}
              />
            </Stack>
          </Box>
        </Box>

        <Box className={styles.UserDescription}>
          <Box sx={{ color: "#777777" }}>
            -{" "}
            {userInfo?.Bios?.Bio1 === undefined ? "empty" : userInfo.Bios.Bio1}
          </Box>
          <Box sx={{ color: "#777777" }}>
            -{" "}
            {userInfo?.Bios?.Bio2 === undefined ? "empty" : userInfo.Bios.Bio2}
          </Box>
          <Box sx={{ color: "#777777" }}>
            -{" "}
            {userInfo?.Bios?.Bio3 === undefined ? "empty" : userInfo.Bios.Bio3}
          </Box>
          <Box sx={{ color: "#777777" }}>
            -{" "}
            {userInfo?.Bios?.Bio4 === undefined ? "empty" : userInfo.Bios.Bio4}
          </Box>
        </Box>

        <Box className={styles.followersCount}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "110px",
            }}
          >
            <GroupsIcon fontSize="medium" />
            <p style={{ fontSize: "11px", color: "#777777" }}>
              
              <span style={{marginRight:"5px"}}>{!userInfo?.followedUsers?.length ? 0 : userInfo.followedUsers.length}</span>
              {userInfo?.followedUsers?.length === 1 ? "Follower" : "Followers"}
            </p>
          </Box>
          <Box>
            <img
              src="https://www.logomaker.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kh...CCrhNMmBfFwXs1M3EMoAJtlyAthvFv...foz"
              alt="logo"
              width={40}
              height={25}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <p
            className={styles.EditBtn}
            onClick={async () => {
              if (userInfo?.followedUsers) {
                if (userInfo.followedUsers.includes(user?.uid)) {
                  await handleUnfollowUser(userInfo);
                } else {
                  await handleFollowUser(userInfo);
                }
              } else {
                await handleFollowUser(userInfo);
              }
            }}
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: "grey" }} />
            ) : (
              <>
                {userInfo?.followedUsers
                  ? userInfo.followedUsers.includes(user?.uid)
                    ? "unfollow"
                    : "follow"
                  : "follow"}
              </>
            )}
          </p>

          <p className={styles.EditBtn}>Collaborate</p>
        </Box>

        <Box>
          <BasicTabs />
        </Box>
      </Box>
    </>
  );
}

export default UsersInformation;
