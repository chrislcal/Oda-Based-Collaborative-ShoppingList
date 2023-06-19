import { Box, Button, TextField, Dialog, DialogTitle, DialogContent } from "@mui/material";
import handlelisteLogo from "../resources/images/handlelisteLogo.png";
import "../styles/style.css";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useEffect, useState, useContext } from "react";  
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

import '../styles/style.css'



const Login = () => {

  const [passwordDialog, setPasswordDialog] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  // Get the minimal text from auth error
const filterError = (error) => {
  if (typeof error === "object" && error.message) {
    const rawError = error.message.split('/');
    const message = rawError[1].replace('-', ' ').replace(')', '');
    const words = message.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const result = words.join(' ');
    setError(result);
  }
}


const handleLogin = async (event) => {
  event.preventDefault(); 
  try {
    await login(email, password);
    navigate('/');
  } catch (error) {
    console.error(error.message);
    filterError(error);
  }
};


  const handleOpenDialog = () => setPasswordDialog(true)
  const handleCloseDialog = () => setPasswordDialog(false)

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, resetEmail)
    .then(() => {
      handleCloseDialog();
    })
    .catch((error) => {
      setError(error.message)
    })
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      sx={{ width: "100vw", height: "100vh" }}
    >
      <Box
        id='login-container'
        sx={{
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "center",
        }}
      >
        <img src={handlelisteLogo} style={{ width: 200 }}></img>
        <form onSubmit={handleLogin}>
          <TextField 
            error={error === 'User Not-found.'}
            helperText={error === 'User Not-found.' && 'Bruker finnes ikke'}
            fullWidth 
            label="Epost" 
            id='emailInput'
            sx={{ marginBottom: 2 }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            error={error === 'Wrong Password.'}
            helperText={error === 'Wrong Password.' && 'Feil passord'}
            fullWidth
            label="Passord"
            id="filled-password-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ height: 60, width: "100%", marginTop: 2, marginBottom: 1.5 }}
          >
            Logg Inn
          </Button>
        <Button
          onClick={() => {navigate('/signup')}}
          variant="contained"
          size="large"
          sx={{
            height: 60,
            width: "100%",
            backgroundColor: "#009688",
            '&:hover': {
              backgroundColor: '#00796b',  
            }
          }}
          >
          Registrer
        </Button>
          </form>
        <Button
          onClick={handleOpenDialog}
          variant="text"
          size="small"
          sx={{marginTop: 1}}
        >
          Glemt passord?
        </Button>
        <Dialog open={passwordDialog} onClose={handleCloseDialog}>
          <DialogTitle>Tilbakestill passord</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="resetEmail"
              label="Epost"
              type="email"
              fullWidth
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <Button onClick={handleForgotPassword} color="primary">
                Send link
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Login;
