import { Box, Button, TextField } from "@mui/material";

import handlelisteLogo from "../resources/images/handlelisteLogo.png";

import { useNavigate } from "react-router-dom";

//Firebase imports
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

import { useState } from "react";

const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleSignup = (e) => {

    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        const newUserDocRef = doc(db, 'users', cred.user.uid);
        return setDoc(newUserDocRef, {
          email: email
        }, { merge: true });
      })
      .then(() => {
        navigate('/');

      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleCancel = () => {
    navigate('/login');
  };
  
  return (
    <Box
      className="signup-container"
      display="flex"
      flexDirection="column"
      gap={1}
      sx={{ width: "100vw", height: "100vh" }}
    >
      <Box
        id="signup-content-container"
        sx={{
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
        }}
      >
        <img src={handlelisteLogo} alt="App logo" style={{ width: 200 }}></img>
        <form onSubmit={handleSignup}>
          <TextField
            sx={{marginBottom: 1, marginTop: 1}}
            fullWidth
            label="Epost"
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
          <TextField
            sx={{marginBottom: 1, marginTop: 1}}
            fullWidth
            label="Passord"
            onChange={(e) => setPassword(e.target.value)}
            id="filled-password-input"
            type="password"
          />
          <TextField
            sx={{marginBottom: 1, marginTop: 1}}
            fullWidth
            label="Gjenta Passord"
            id="filled-password-input"
            type="password"
          />
          <Button
            variant="contained"
            size="large"
            sx={{ height: 60, width: "100%", marginTop: 2 }}
            type="submit"
          >
            Opprett Bruker
          </Button>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          sx={{ height: 60, width: "100%", mt: 2 }}
          onClick={handleCancel}
          >
          Avbryt
        </Button>
          </form>
      </Box>
    </Box>
  );
};

export default Signup;
