import React from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";

function Layout({ children }) {
  const params = useLocation();
  const signup = "/signup";
  const login = "/login";
  const forgot = "/account/reset/password";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {params.pathname === signup ||
      params.pathname === login ||
      params.pathname === forgot ? (
        <>{children}</>
      ) : (
        <>
          <Box sx={{ width: "100%", height: "80px" }}>
            <Navbar />
          </Box>
          <Box sx={{ width: "100%" , marginBottom:"20px"}}>{children}</Box>
          <Box
            sx={{
              width: "100px",
              color: "grey",
              position: "fixed",
              bottom: "20px",
              right: "10px",
              cursor: "pointer",
            }}
            onClick={scrollToTop}
          >
            <ArrowCircleUpRoundedIcon sx={{ fontSize: "50px" }} />
          </Box>
        </>
      )}
    </div>
  );
}

export default Layout;
