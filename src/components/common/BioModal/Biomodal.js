import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import EditIcon from '@mui/icons-material/Edit';


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
  flexDirection: "column",
};

export default function Biomodal(props) {
  const { user, fetchData } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const db = getFirestore();
  const userDocRef = doc(db, "users", user.uid);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    props.setBio((prevBio) => ({
      ...prevBio,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const existingData = (await getDoc(userDocRef)).data();
      await setDoc(userDocRef, {
        ...existingData,
        Bios: props.bio,
      });
      fetchData();
      handleClose();
      setLoading(false);
    } catch (error) {
      console.error("Error updating user profile: ", error);
    }
  };

  return (
    <div>
      <p onClick={handleOpen} style={{ cursor:"pointer",display:"flex", alignItems:"center", justifyContent:"space-between", width:"45px", color:"#777777"}}>{"Bio"} <EditIcon fontSize="small"/></p>
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
              {loading ? (
                <CircularProgress size={20} style={{ color: "#1e1e1e" }} />
              ) : (
                "save"
              )}
            </button>
          </Box>

          <Box sx={input}>
            <form onSubmit={handleSubmit}>
              <Box sx={inputsContainer}>
                <input
                  type="name"
                  name="Bio1"
                  placeholder="Enter Bio"
                  onChange={handleChange}
                  style={inputs}
                />
                <input
                  type="name"
                  name="Bio2"
                  placeholder="Enter Bio"
                  onChange={handleChange}
                  style={inputs}
                />
                <input
                  type="name"
                  name="Bio3"
                  placeholder="Enter Bio"
                  onChange={handleChange}
                  style={inputs}
                />
                <input
                  type="text"
                  name="Bio4"
                  placeholder="Enter Bio"
                  onChange={handleChange}
                  style={inputs}
                />
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

const inputsContainer = {
  width: "100%",
  height: "300px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  flexDirection: "column",
};

const inputs = {
  width: "90%",
  height: "45px",
  paddingLeft: "10px",
  background: "#1e1e1e",
  border: "none",
  borderRadius: "10px",
  color: "#777777",
};
