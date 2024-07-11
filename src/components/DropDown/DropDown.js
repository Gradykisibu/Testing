import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function DropDown() {
  const nav = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    nav("/account/user/profile");
    handleClose();
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("loggedOut");
        nav("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <p onClick={handleClick}>
        <DragHandleIcon fontSize="large" />
      </p>
      <Menu
        // id="basic-menu"
        color={"red"}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: {
            backgroundColor: "#1e1e1e",
            borderRadius: "20px",
          },
        }}
        sx={{ marginLeft: "-20px" }}
      >
        <MenuItem sx={{ color: "white", display: { sm: "block", md: "none" } }}>
          Home
        </MenuItem>
        <MenuItem sx={{ color: "white", display: { sm: "block", md: "none" } }}>
          Search
        </MenuItem>
        <MenuItem sx={{ color: "white", display: { sm: "block", md: "none" } }}>
          Activity
        </MenuItem>
        <MenuItem onClick={handleProfile} style={{ color: "white" }}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} style={{ color: "white" }}>
          Account
        </MenuItem>
        <MenuItem onClick={handleLogout} style={{ color: "white" }}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
