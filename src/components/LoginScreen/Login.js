import React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import SimpleAlert from "../Alert/SimpleAlert";

function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    duration: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        const LoggedUser = userCredential.user;
        nav("/");
        setLoading(false);      
        console.log(LoggedUser);
      })
      .catch((error) => {
        setLoading(false);
        setAlert({
          message: error.message,
          type: "error",
          duration: 5000,
          open: true,
        });
      });
  };

  const handleLoginRoute = () => {
    nav("/signup");
  };

  const LoginBtn = {
    width: "95%",
    height: "45px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    color: "#777777",
    background: "#1e1e1e",
    fontsFamily: "sans-seriff",
    fontWeight: "bold",
  };

  return (
    <Box sx={SignupContainer}>
      <SimpleAlert
        close={() =>
          setAlert({
            message: "",
            type: "",
            duration: "",
            open: false,
          })
        }
        {...alert}
      />
      <Box>
        <img
          src="https://www.logomaker.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kh...CCrhNMmBfFwXs1M3EMoAJtlyAthvFv...foz"
          alt="logo"
          width={150}
          height={100}
        />
      </Box>
      <Box sx={SignupFormContainer}>
        <form onSubmit={handleSubmit}>
          <Box sx={inputsContainer}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Adress"
              onChange={handleChange}
              style={inputs}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              style={inputs}
            />
            <button type="submit" style={LoginBtn}>
              {loading ? (
                <CircularProgress size={20} style={{ color: "grey" }} />
              ) : (
                "Log in"
              )}
            </button>

            <p style={loginRoute} onClick={handleLoginRoute}>
              Can't remember your password ?
            </p>
          </Box>
        </form>

        <Box sx={orLineText}>
          {" "}
          <hr style={{ width: "120px", border: "1px solid #777777" }} />
          or <hr style={{ width: "120px", border: "1px solid #777777" }} />
        </Box>

        <Box sx={createNew} onClick={handleLoginRoute}>
          <p style={loginRoute}>Create new account</p>
        </Box>
      </Box>
      <Box sx={footerContainer}>
        <p style={footerText}>© 2023</p>
        <p style={footerText}>CloudMix Terms</p>
        <p style={footerText}>Privacy Policy</p>
        <p style={footerText}>Cookies Policy</p>
        <p style={footerText}>Report a problem</p>
      </Box>
    </Box>
  );
}

export default Login;

const SignupContainer = {
  width: "100%",
  height: "100vh",
  background: "#101010",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

const SignupFormContainer = {
  width: "300px",
  height: "400px",
};

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

const loginRoute = {
  fontSize: "12px",
  color: "#777777",
  cursor: "pointer",
};

const orLineText = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  color: "#777777",
};

const createNew = {
  width: "100%",
  height: "50px",
  background: "#1e1e1e",
  marginTop: "20px",
  color: "black",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const footerContainer = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  fontSize: "14px",
  color: "#777777",
};

const footerText = {
  marginLeft: "10px",
  cursor: "pointer",
};
