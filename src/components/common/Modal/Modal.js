import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import LockIcon from "@mui/icons-material/Lock";
import EditModal from "../EditModal/EditModal";
import Biomodal from "../BioModal/Biomodal";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import ImageModal from "../ImageModal/ImageModal";
import CancelIcon from '@mui/icons-material/Cancel';

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
  height: "470px",
};

export default function BasicModal(props) {
  const { user } = useAuthContext();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState({
    Bio1: "",
    Bio2: "",
    Bio3: "",
    Bio4: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFetchUser = () => {
    handleClose();
  }

  return (
    <div>
      <p onClick={handleOpen} className={props.className}>
        Edit Profile
      </p>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{width:"98%",display:"flex", alignItems:"center", justifyContent:"flex-end"}}>
            <CancelIcon sx={{cursor:"pointer"}} onClick={handleClose}/>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <LockIcon sx={{ fontSize: "12px", marginRight: "5px" }} />{" "}
              <p>Name</p>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                marginTop: "-17px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {user?.name ? user.name : "No name"}{" "}
                <span style={{ marginLeft: "10px" }}>
                  <EditModal
                    name={"Edit Name"}
                    stateName={name}
                    setStateName={setName}
                  />
                </span>
              </Box>
              <ImageModal/>
            </Box>
          </Box>

          <hr />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <LockIcon sx={{ fontSize: "12px", marginRight: "5px" }} />{" "}
            <p>Bio</p>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              fontSize: "14px",
              flexDirection: "column",
            }}
          >
            <Biomodal name={"Edit Bio"} bio={bio} setBio={setBio} />
            <Box sx={UserDescription}>
              <Box sx={{ color: "#777777" }}>
                -{" "}
                {user?.Bios?.Bio1 === undefined ? "Insert Bio" : user.Bios.Bio1}
              </Box>
              <Box sx={{ color: "#777777" }}>
                -{" "}
                {user?.Bios?.Bio2 === undefined ? "Insert Bio" : user.Bios.Bio2}
              </Box>
              <Box sx={{ color: "#777777" }}>
                -{" "}
                {user?.Bios?.Bio3 === undefined ? "Insert Bio" : user.Bios.Bio3}
              </Box>
              <Box sx={{ color: "#777777" }}>
                -{" "}
                {user?.Bios?.Bio4 === undefined ? "Insert Bio" : user.Bios.Bio4}
              </Box>
            </Box>
          </Box>

          <hr />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <LockIcon sx={{ fontSize: "12px", marginRight: "5px" }} />{" "}
            <p>Link</p>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              fontSize: "14px",
              flexDirection: "column",
            }}
          >
            <Box sx={{ color: "#777777" }}> + {"Add Link"}</Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: "40px",
              marginBottom:"20px",
              height: "40px",
              background: "white",
              color: "#1e1e1e",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={handleFetchUser}
          >
            Save
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

const UserDescription = {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  color: "#F3F5F7",
};
