
import style from './styles/style.css';

//React imports
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation} from 'react-router-dom';

//Material UI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import PersonIcon from '@mui/icons-material/Person';

//Importing page-components
import Search from './Page-Components/Search';
import ShoppingList from './Page-Components/ShoppingList';
import Profile from './Page-Components/Profile';


//Firebase Imports
import {initializeApp} from 'firebase/app';
import {getFirestore, collection, getDocs, addDoc} from 'firebase/firestore';

//Firebase Config
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  //Initialize Firebase Connection
  initializeApp(firebaseConfig);

  //Initialize service
  export const db = getFirestore()

  //Collection reference
  export const colRef = collection(db, 'Varer');



const lightTheme = createTheme({
  palette: {
    mode: 'light',
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
    },
    primary: {
      main: '#655DBB',
    },
    secondary: {
      main: '#f44336',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ECF2FF',
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
        sx={{ color: 'white', bgcolor: 'primary.dark', position: 'fixed', bottom: 0, width: '100%' }}
      >
        <BottomNavigationAction
          value="/search"
          component={NavLink}
          to="/search"
          label="Søk"
          icon={<SearchIcon sx={{ color: value === '/search' ? 'dodgerblue' : 'white' }} />}
          sx={{
            '&.Mui-selected .MuiBottomNavigationAction-label': {
              color: 'dodgerblue',
            },
          }}
        />
        <BottomNavigationAction
          value="/"
          component={NavLink}
          to="/"
          label="Handleliste"
          icon={<ChecklistRtlIcon sx={{ color: value === '/' ? 'dodgerblue' : 'white' }} />}
          sx={{
            '&.Mui-selected .MuiBottomNavigationAction-label': {
              color: 'dodgerblue',
            },
          }}
        />
        <BottomNavigationAction
          value="/profile"
          component={NavLink}
          to="/profile"
          label="Profil"
          icon={<PersonIcon sx={{ color: value === '/profile' ? 'dodgerblue' : 'white' }} />}
          sx={{
            '&.Mui-selected .MuiBottomNavigationAction-label': {
              color: 'dodgerblue',
            },
          }}
        />
      </BottomNavigation>
    );
  };

  
  

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={lightTheme}>
        <Routes>
          <Route path="/" element={<ShoppingList />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
