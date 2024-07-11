import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

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
  borderRadius: "10px",
  height: "430px",
  display: "flex",
  justifyContent: "center",
};

export default function FollowCountModal(props) {
  
  const { user } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const followedUsers = user?.followedUsers || [];
  
  const filteredUsers = props.getUsers.filter(
    (getUser) => getUser.id !== user.uid && !followedUsers.includes(getUser.id)
  ); 

  console.log('filteredUsers:', filteredUsers)

  return (
    <div>
      <p onClick={handleOpen}>{props.Follow}</p>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{backgroundColor:"#1e1e1e",width:"100%", height:"50px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px"}}> <span style={{marginRight:"5px"}}>Followers</span> <ConnectWithoutContactIcon sx={{fontSize:"18px"}}/> ({filteredUsers.length})</Box>
        </Box>
      </Modal>
    </div>
  );
}
