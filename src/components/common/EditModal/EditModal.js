import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
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
};

const inputs = {
  width: "90%",
  height: "45px",
  paddingLeft: "10px",
  background: "#0A0A0A",
  border: "1px solid #1e1e1e",
  borderRadius: "10px",
  color: "#777777",
};

export default function EditModal(props) {
  const { user, fetchData } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const auth = getAuth();
  const db = getFirestore();
  const uid = auth.currentUser.uid;
  const userDocRef = doc(db, "users", uid);
  const [loading, setLoading] = React.useState(false);
  const handleClose = () => {
    props.setStateName("Insert Name");
    setOpen(false);
  };

  const handleNameChange = (event) => {
    props.setStateName(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (props.stateName.length > 12) {
      window.alert("Name length exceeded 7 characters");
    } else if (props.stateName.length <= 12) {
      props.setStateName(props.stateName);
      setLoading(true);
      try {
        const existingData = (await getDoc(userDocRef)).data();
        await setDoc(userDocRef, {
          ...existingData,
          initial: props.stateName,
        });
        fetchData();
        handleClose();
        setLoading(false);
      } catch (error) {
        console.error("Error updating user profile: ", error);
        setLoading(false);
      }

      setOpen(false);
    }
  };

  return (
    <div>
      <p onClick={handleOpen} style={{ cursor:"pointer",display:"flex", alignItems:"center", justifyContent:"space-between", width:"45px", color:"#777777"}}>
        {" "}
        {user?.initial ? user.initial : "Insert Initial"} <EditIcon fontSize="small"/>
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
            <input
              type="name"
              placeholder="Insert Name"
              onChange={handleNameChange}
              style={inputs}
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
