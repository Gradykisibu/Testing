import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import ImageIcon from "@mui/icons-material/Image";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TagIcon from "@mui/icons-material/Tag";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import { useFeedContext } from "../../context/FeedContext/FeedContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  height: 250,
  background: "rgba(16, 16, 16, 0.9)",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  p: 4,
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  flexDirection: "column",
  borderRadius: "10px",
  border: "1px solid #1e1e1e",
};

const div1 = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
};

const div2 = {
  width: "87%",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  height: "40px",
  marginTop: "5px",
  paddingLeft: "27px",
};

export default function PostFeed() {
  const [open, setOpen] = React.useState(false);
  const [postText, setPostText] = useState("");
  const [postSongName, setPostSongName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { setPostedFeed ,fetchAllUsersFeeds, fetchAllUsers,} = useFeedContext();
  const handleOpen = () => {
    setPostText(null);
    setPostSongName(null);
    setImageFile(null);
    setAudioFile(null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const firestore = getFirestore();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  const handlePost = async () => {
    setLoading(true);
    const feedsCollection = collection(firestore, "feeds");
  
    try {
      // Upload image file to Firebase Storage
      let imageUrl = "";
      if (imageFile) {
        const imageStorageRef = storageRef(
          getStorage(),
          `images/${user?.uid}/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(imageStorageRef, imageFile);
        imageUrl = await getDownloadURL(imageStorageRef);
      }
  
      // Upload audio file to Firebase Storage
      let audioUrl = "";
      if (audioFile) {
        const audioStorageRef = storageRef(
          getStorage(),
          `audio/${user?.uid}/${Date.now()}_${audioFile.name}`
        );
        await uploadBytes(audioStorageRef, audioFile);
        audioUrl = await getDownloadURL(audioStorageRef);
      }
  
      // Add a new document to the 'feeds' collection
      const docRef = await addDoc(feedsCollection, {
        text: postText,
        songname: postSongName,
        image: imageUrl,
        audio: audioUrl,
        userId: user?.uid,
        timestamp: serverTimestamp(),
      });
  
      // Update user object with the new post in the 'userFeed' array
      const userDocRef = doc(firestore, "users", user?.uid);
      await updateDoc(userDocRef, {
        userFeed: arrayUnion(docRef.id),
      });
  
      // Document added successfully
      console.log("Post added with ID: ", docRef.id);
      fetchAllUsers();
      fetchAllUsersFeeds();
      setPostedFeed(true);
  
      // Reset state values after posting
      setPostText("");
      setPostSongName("");
      setImageFile(null);
      setAudioFile(null);
  
      // Close the modal
      setPostedFeed(false);
      handleClose();
    } catch (error) {
      console.error("Error adding post: ", error);
      setLoading(false);
    }
    setLoading(false);
  };
  
  return (
    <div>
      <Box onClick={handleOpen}>
        {" "}
        <EditNoteIcon fontSize="large" />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <Box sx={div1}>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    alt="Remy Sharp"
                    src={user?.image}
                    width={300}
                    height={300}
                  />
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    paddingLeft: "10px",
                  }}
                >
                  <p style={{ color: "#777777" }}>@{user?.initial}</p>
                  <input
                    type="text"
                    value={postSongName}
                    onChange={(e) => setPostSongName(e.target.value)}
                    placeholder="Song name..."
                    style={{
                      border: "1px solid #1e1e1e",
                      background: "transparent",
                      color: "grey",
                      height: "30px",
                      fontSize: "15px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                    }}
                  />
                  <input
                    type="text"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Start a feed..."
                    style={{
                      border: "1px solid #1e1e1e",
                      background: "transparent",
                      color: "grey",
                      height: "30px",
                      fontSize: "15px",
                      borderRadius: "5px",
                    }}
                  />
                </Box>
              </Box>

              <Box sx={div2}>
                <Box
                  sx={{
                    width: "150px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <IconButton component="label" sx={{ color: "#777777" }}>
                    <MusicNoteIcon
                      sx={{ color: audioFile?.name ? "green" : "grey" }}
                    />
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioChange}
                      style={{ display: "none" }}
                    />
                  </IconButton>
                  <IconButton component="label" sx={{ color: "#777777" }}>
                    <ImageIcon
                      sx={{ color: imageFile?.name ? "green" : "grey" }}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </IconButton>
                  <p>
                    <TagIcon sx={{ color: "#777777", cursor: "pointer" }} />
                  </p>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                width: "50%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "green",
                flexDirection: "column",
              }}
            >
              {imageFile?.name && (
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Attached - <ImageIcon sx={{ color: "green" }} />
                </p>
              )}
              {audioFile?.name && (
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Attached - <MusicNoteIcon sx={{ color: "green" }} />
                </p>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "35px",
              background: "#1e1e1e",
              borderRadius: "6px",
              cursor: "pointer",
              color: "#777777",
            }}
            onClick={handlePost}
          >
            {" "}
            {loading ? "posting..." : "post"}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
