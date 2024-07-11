import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./home.module.css";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SendIcon from "@mui/icons-material/Send";
import { Triangle } from "react-loader-spinner";
import CustomAudioPlayer from "../CustomAudio/CustomAudioPlayer";
import { useFeedContext } from "../context/FeedContext/FeedContext";
import SimpleAlert from "../Alert/SimpleAlert";
import { useAuthContext } from "../context/AuthContext/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import ViewComment from "../common/ViewComment/ViewComment";

function Home() {

  const [commmentLoader, setCommentLoader] = useState({});
  const [deleteLoader, setDeleteLoader ] = useState({});
  const { setFeeds, feeds, fetchAllUsers, fetchAllUsersFeeds, getUsers, loader, postedFeed} =
    useFeedContext();
  const { user } = useAuthContext();
  const [inputText, setInputText] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    duration: "",
    type: "",
  });

 

//   const fetchAllUsersFeeds = async () => {
//   setLoader(true);

//   if (!isDataFetched) {
//     try {
//       // Check if data exists in localStorage
//       const cachedFeeds = localStorage.getItem('feeds');
//       if (cachedFeeds) {
//         setFeeds(JSON.parse(cachedFeeds));
//         markDataAsFetched();
//         setLoader(false);
//         return;
//       }

//       const db = getFirestore();
//       const usersCollection = collection(db, "feeds");
//       const usersSnapshot = await getDocs(usersCollection);
//       const fetchedFeeds = usersSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const shuffledFeeds = shuffleArray(fetchedFeeds);
//       setFeeds(shuffledFeeds);
//       markDataAsFetched();
      
//       // Store fetched data in localStorage
//       localStorage.setItem('feeds', JSON.stringify(shuffledFeeds));
//     } catch (error) {
//       console.error("Error fetching feeds:", error);
//       setAlert({
//         message: error.message,
//         type: "error",
//         duration: 5000,
//         open: true,
//       });
//     } finally {
//       setLoader(false);
//     }
//   } else {
//     setLoader(false);
//   }
// };

// const fetchAllUsers = async () => {
//   try {
//     // Check if data exists in localStorage
//     const cachedUsers = localStorage.getItem('users');
//     if (cachedUsers) {
//       setGetUsers(JSON.parse(cachedUsers));
//       return;
//     }

//     const allUsers = await getAllUsersFromFirestore();
//     setGetUsers(allUsers);
    
//     // Store fetched data in localStorage
//     localStorage.setItem('users', JSON.stringify(allUsers));
//   } catch (error) {
//     console.error("Error fetching all users:", error);
//     setAlert({
//       message: error.message,
//       type: "error",
//       duration: 5000,
//       open: true,
//     });
//   }
// };

  useEffect(() => {
    fetchAllUsers({ setAlert});
    fetchAllUsersFeeds({ setAlert});
  }, [postedFeed,fetchAllUsers,fetchAllUsersFeeds]);

  const handleInputChange = (itemId, value) => {
    setInputText((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleSubmitComment = async (itemId, user) => {
    setCommentLoader((prev) => ({ ...prev, [itemId]: true }));
    try {
      const db = getFirestore();
      const postRef = doc(db, "feeds", itemId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const currentComments = postDoc.data().comments || [];
        const newComment = {
          text: inputText[itemId],
          userName: user.name,
          userId: user.uid,
          userImage: user.image,
          id: itemId,
        };
        const updatedComments = [...currentComments, newComment];

        await updateDoc(postRef, { comments: updatedComments });

        setFeeds((prevFeeds) => {
          const updatedFeeds = prevFeeds.map((feed) => {
            if (feed.id === itemId) {
              return { ...feed, comments: updatedComments };
            }
            return feed;
          });
          return updatedFeeds;
        });
        setCommentLoader(false);
        setAlert({
          message: "Comment has been added",
          type: "success",
          duration: 5000,
          open: true,
        });
      } else {
        setCommentLoader((prev) => ({ ...prev, [itemId]: false }));
        setAlert({
          message: `Comment with ID ${itemId} does not exist`,
          type: "warning",
          duration: 5000,
          open: true,
        });
      }

      setInputText((prev) => ({
        ...prev,
        [itemId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentLoader((prev) => ({ ...prev, [itemId]: false }));

      setAlert({
        message: "Error could not add comment",
        type: "error",
        duration: 5000,
        open: true,
      });
    }
    setCommentLoader((prev) => ({ ...prev, [itemId]: false }));
  };

  const handleDeleteComment = async (itemId, commentIndex) => {
    setDeleteLoader((prev) => ({ ...prev, [commentIndex]: true }));
    try {
      const db = getFirestore();
      const postRef = doc(db, "feeds", itemId);
      const postDoc = await getDoc(postRef);
  
      if (postDoc.exists()) {
        const currentComments = postDoc.data().comments || [];
        const updatedComments = [...currentComments];
        updatedComments.splice(commentIndex, 1); // Remove the comment at the specified index
  
        await updateDoc(postRef, { comments: updatedComments });
  
        setFeeds((prevFeeds) => {
          const updatedFeeds = prevFeeds.map((feed) => {
            if (feed.id === itemId) {
              return { ...feed, comments: updatedComments };
            }
            return feed;
          });
          return updatedFeeds;
        });
        setDeleteLoader((prev) => ({ ...prev, [commentIndex]: false }));
        setAlert({
          message: "Comment has been deleted",
          type: "success",
          duration: 5000,
          open: true,
        });
      } else {
        setDeleteLoader((prev) => ({ ...prev, [commentIndex]: false }));
        setAlert({
          message: `Feed with ID ${itemId} does not exist`,
          type: "warning",
          duration: 5000,
          open: true,
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      setDeleteLoader((prev) => ({ ...prev, [commentIndex]: false }));
  
      setAlert({
        message: "Error could not delete comment",
        type: "error",
        duration: 5000,
        open: true,
      });
    }
  };
  

  const handleLikePost = async (postId, user) => {
    try {
      const db = getFirestore();
      const postRef = doc(db, "feeds", postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const currentLikes = postDoc.data().likes || [];
        const userLikedIndex = currentLikes.indexOf(user?.uid);

        if (userLikedIndex === -1) {
          const updatedLikes = [...currentLikes, user?.uid];
          await updateDoc(postRef, { likes: updatedLikes });

          setFeeds((prevFeeds) => {
            const updatedFeeds = prevFeeds.map((feed) => {
              if (feed.id === postId) {
                return { ...feed, likes: updatedLikes };
              }
              return feed;
            });
            return updatedFeeds;
          });

          setAlert({
            message: "Post has been liked",
            type: "success",
            duration: 5000,
            open: true,
          });
        } else {
          const updatedLikes = currentLikes.filter(
            (_, index) => index !== userLikedIndex
          );
          await updateDoc(postRef, { likes: updatedLikes });

          setFeeds((prevFeeds) => {
            const updatedFeeds = prevFeeds.map((feed) => {
              if (feed.id === postId) {
                return { ...feed, likes: updatedLikes };
              }
              return feed;
            });
            return updatedFeeds;
          });

          setAlert({
            message: "You unliked the post",
            type: "success",
            duration: 5000,
            open: true,
          });
        }
      } else {
        console.log(`Post with ID ${postId} does not exist`);
        setAlert({
          message: `Post with ID ${postId} does not exist`,
          type: "warning",
          duration: 5000,
          open: true,
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setAlert({
        message: "Error could not like post",
        type: "error",
        duration: 5000,
        open: true,
      });
    }
  };

  return (
    <Box className={styles.homeMainContainer}>
      <SimpleAlert
        close={() =>
          setAlert({
            message: "",
            type: "",
            duration: "",
            open: false,
          })
        }
        {...alert}
      />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: { xs: "block", sm: "block", md: "none", lg: "none" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            mb: "30px",
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
        sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}
      >
        {loader && (
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </Box>
        )}
        {!loader && (
          <>
            {feeds.map((item) => {
              const matchingUser = getUsers.find((user) =>
                user.userFeed?.includes(item.id)
              );
              // const timestamp = item?.timestamp?.toDate();
              // const formattedDate = timestamp?.toLocaleDateString();

              return (
                <Box
                  key={item.id}
                  item={item}
                  sx={{
                    marginTop: "20px",
                    borderBottom: "1px solid #1e1e1e",
                    paddingBottom: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      mb: "10px",
                      ml: { xs: "10px", md: "0px" },
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        alt="Remy Sharp"
                        src={matchingUser?.image || ""}
                        width={200}
                        height={200}
                      />
                    </Stack>
                    <p
                      style={{
                        marginLeft: "10px",
                        fontWeight: "bold",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      @{matchingUser?.initial || "Unknown User"} .{" "}
                      <span style={{ fontSize: "9px", color: "#777777" }}>
                        {/* {formattedDate} */}
                      </span>{" "}
                    </p>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.image && (
                      <img
                        src={item?.image}
                        alt="feed"
                        width={450}
                        height={400}
                        style={{
                          width: "80%",
                          maxWidth: "450px",
                          height: "auto",
                          borderRadius: "15px",
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.audio && (
                      <CustomAudioPlayer
                        src={item.audio}
                        songname={item.songname}
                      />
                    )}
                  </Box>

                  <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
                    {item.text && (
                      <p>
                        {" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "white",
                            fontSize: "11px",
                          }}
                        >
                          {matchingUser?.initial}
                        </span>{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#777777",
                            width: "450px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            flexWrap: "wrap",
                            marginTop: "10px",
                          }}
                        >
                          {item.text}
                        </span>
                      </p>
                    )}
                  </Box>

                  <Box
                    sx={{
                      mt: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Box sx={{ color: "white", fontSize: "15px", mr: "3px" }}>
                      {item.likes ? <p>{item.likes.length}</p> : <p>0</p>}
                    </Box>
                    <FavoriteBorderOutlinedIcon
                      fontSize="medium"
                      sx={{
                        color:
                          item.likes && item.likes.includes(user?.uid)
                            ? "red"
                            : "grey",
                        cursor: "pointer",
                        mr: "3px",
                      }}
                      onClick={() => handleLikePost(item.id, user)}
                    />
                    <ViewComment comments={item.comments} image={item.image} handleDeleteComment={handleDeleteComment} loader={deleteLoader}/>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="comment..."
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "grey",
                        height: "30px",
                        fontSize: "15px",
                        borderRadius: "5px",
                        width: "400px",
                      }}
                      value={inputText[item.id] || ""}
                      onChange={(e) =>
                        handleInputChange(item.id, e.target.value)
                      }
                    />

                    {commmentLoader[item.id] ? (
                      <CircularProgress size={20} style={{ color: "grey" }} />
                    ) : (
                      <SendIcon
                        sx={{ color: "grey", cursor: "pointer" }}
                        onClick={() => handleSubmitComment(item.id, user)}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
}

export default Home;
