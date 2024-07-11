import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#101010",
  border: "1px solid #1e1e1e",
  p: 4,
  color: "#F3F5F7",
};

const nameField = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const btnClose = {
  border: "none",
  width: "80px",
  height: "30px",
  borderRadius: "10px",
  background: "#777777",
  color: "red",
  cursor: "pointer",
};

const btnOpen = {
  border: "none",
  width: "80px",
  height: "30px",
  borderRadius: "10px",
  background: "#777777",
  color: "green",
  cursor: "pointer",
};

const input = {
  width: "100%",
  marginTop: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function ImageModal(props) {
  const { user, fetchData } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const db = getFirestore();
  const userDocRef = doc(db, "users", user.uid);
  const [image, setImage] = React.useState(null);
  const storage = getStorage();
  const storageRef = ref(storage, `images/${user.uid}`);
  const [loading, setLoading] = React.useState(false);
  

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        // Set the state with the download URL
        setImage(downloadURL);
      } catch (error) {
        console.error("Error uploading image to storage: ", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const existingData = (await getDoc(userDocRef)).data();
      await setDoc(userDocRef, {
        ...existingData,
        image: image,
      });
      setOpen(false);
      fetchData()
      handleClose();
      setLoading(false);
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  };

  return (
    <div>
      <p onClick={handleOpen}>
        {" "}
        <Stack direction="row" spacing={2}>
          <Avatar alt="Remy Sharp" src={user.image} width={200} height={200} />
        </Stack>
      </p>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={nameField}>
            <button style={btnClose} onClick={handleClose}>
              close
            </button>
            {props.name}
            <button style={btnOpen} onClick={handleSubmit}>
              {!loading ? (
                "save"
              ) : (
                <CircularProgress size={20} style={{ color: "#1e1e1e" }} />
              )}
            </button>
          </Box>

          <Box sx={input}>
            <input type="file" name="file" onChange={handleChange} />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
