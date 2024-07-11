import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 500,
  bgcolor: "#1e1e1e",
  boxShadow: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function ViewFeed({ open, handleClose, storeFeed }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Box sx={{ width: "50%", height: "100%", background:"black"}}>
            {storeFeed && (
              <Box
                sx={{
                    backgroundImage: storeFeed[0]?.image
                    ? `url(${storeFeed[0]?.image})`
                    : "none",
                  backgroundSize: 'contain',
                  backgroundPosition: 'left center',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </Box>
          <Box sx={{ width:"50%", background:"black", height:"100%"}}>hello</Box>
        </Box>
      </Modal>
    </div>
  );
}
