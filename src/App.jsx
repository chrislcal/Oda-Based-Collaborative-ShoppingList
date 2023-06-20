import style from "./styles/style.css";

//React imports
import { useState, useEffect } from "react";
import { BrowserRouter,Routes,Route,NavLink,
  useLocation,useNavigate,Navigate } from "react-router-dom";

//Material UI Imports
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import PersonIcon from "@mui/icons-material/Person";

//Importing page-components
import Search from "./Page-Components/Search";
import ShoppingList from "./Page-Components/ShoppingList";
import Profile from "./Page-Components/Profile";
import Signup from "./Page-Components/Signup";
import Login from "./Page-Components/Login";


import { AuthProvider, useAuth} from "./AuthContext";

//Firebase import
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebaseConfig";


const lightTheme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#000000",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
    primary: {
      main: "#655DBB",
    },
    secondary: {
      main: "#f44336",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ECF2FF",
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

const BottomNav = () => {
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        color: "white",
        bgcolor: "primary.dark",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <BottomNavigationAction
        value="/search"
        component={NavLink}
        to="/search"
        label="Søk"
        icon={
          <SearchIcon
            sx={{ color: value === "/search" ? "dodgerblue" : "white" }}
          />
        }
        sx={{
          "&.Mui-selected .MuiBottomNavigationAction-label": {
            color: "dodgerblue",
          },
        }}
      />
      <BottomNavigationAction
        value="/"
        component={NavLink}
        to="/"
        label="Handleliste"
        icon={
          <ChecklistRtlIcon
            sx={{ color: value === "/" ? "dodgerblue" : "white" }}
          />
        }
        sx={{
          "&.Mui-selected .MuiBottomNavigationAction-label": {
            color: "dodgerblue",
          },
        }}
      />
      <BottomNavigationAction
        value="/profile"
        component={NavLink}
        to="/profile"
        label="Profil"
        icon={
          <PersonIcon
            sx={{ color: value === "/profile" ? "dodgerblue" : "white" }}
          />
        }
        sx={{
          "&.Mui-selected .MuiBottomNavigationAction-label": {
            color: "dodgerblue",
          },
        }}
      />
    </BottomNavigation>
  );
};

const App = () => {
  
  const { user } = useAuth();

  return (
    <BrowserRouter>
    <ThemeProvider theme={lightTheme}>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              user ? <ShoppingList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="search"
            element={user ? <Search /> : <Navigate to="/login" replace />}
          />
          <Route
            path="profile"
            element={
              user ? <Profile /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
        {user && <BottomNav />}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
};    

export default App;
