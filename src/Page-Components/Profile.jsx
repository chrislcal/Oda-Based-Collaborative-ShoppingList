
import { Box, Typography, Avatar, Button } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { auth} from '../firebaseConfig';
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "../AuthContext";


const Profile = () => {

  const { user: authUser } = useAuth();


  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, authUser.email);
      alert('Password reset email sent!');
    } catch (error) {
      alert(`Error sending password reset email: ${error.message}`);
    }
  };
  
  const handleLogout = () => {
    signOut(auth)
    .then(() => {
        console.log('redirecting to login page')
    })
    .catch((error) => {
        console.error(error.message);
    })
}

return (
  <Box 
    display="flex" 
    flexDirection="column">
    <Box
      display="flex"
      alignItems="center"
      height="100px"
      bgcolor="primary.light"
    >
      <Avatar
        alt="Profile avatar"
        sx={{ margin: 2, padding: 1, bgcolor: deepOrange[500] }}
      >
        {authUser ? authUser.email.charAt(0).toUpperCase() : ''}
      </Avatar>
      <Typography variant="h6" sx={{ color: "white" }}>
        {authUser ? authUser.email : ''}
      </Typography>
    </Box>
    <Box 
      display="flex"
      flexDirection="column" 
      gap={2}
      width='100%'
      alignItems='center'
      mt={5}
      >
      <Button 
        variant="outlined"
        sx={{ margin: "0 10px", height: 50, width: '60%'}}
        onClick={handleResetPassword}
      >
        Bytt Passord
      </Button>

      <Button
        variant="contained"
        color="secondary"
        sx={{ margin: "0 10px", height: 50, width: '60%'}}
        onClick={handleLogout}
      >
        Logg ut
      </Button>
    </Box>
  </Box>
);

};

export default Profile;





