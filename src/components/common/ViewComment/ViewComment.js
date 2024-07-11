import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthContext } from "../../context/AuthContext/AuthContext";

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
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  flexDirection: "column",
  borderRadius: "10px",
  border: "1px solid #1e1e1e",
};

export default function ViewComment(props) {
  const { user } = useAuthContext();
  const { comments, handleDeleteComment, loader } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Box onClick={handleOpen}>
        {" "}
        <ChatBubbleOutlineOutlinedIcon
          fontSize="medium"
          sx={{
            mt: "5px",
            marginLeft: "5px",
            color: "grey",
            cursor: "pointer",
          }}
        />
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {comments && comments?.length > 0 ? (
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              {comments.map((comment, index) => {
                return (
                  <Box key={index} sx={{ color: "grey" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Avatar
                          alt="Remy Sharp"
                          src={comment.userImage}
                          width={200}
                          height={200}
                        />
                      </Stack>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          marginLeft: "7px",
                        }}
                      >
                        {comment?.userName.toUpperCase()}
                      </p>

                      {comment.userName === user?.name && (
                        <Box sx={{marginLeft: "5px",}}>
                          {loader[index] ? (
                            <CircularProgress
                              size={15}
                              style={{ color: "grey"}}
                            />
                          ) : (
                            <DeleteIcon
                              onClick={() =>
                                handleDeleteComment(comment.id, index)
                              }
                              fontSize="medium"
                              sx={{
                                mt: "5px",
                                color: "grey",
                                cursor: "pointer",
                              }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                    <p>{comment.text}</p>
                    <hr />
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e1e1e",
              }}
            >
              <h2>No Comments Available</h2>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}
