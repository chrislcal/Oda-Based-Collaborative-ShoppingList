
import '../styles/style.css'

//MUI Imports
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Box, Alert
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

//Firebase Imports 
import { addDoc, deleteDoc, doc, getDocs, serverTimestamp, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";

//React Imports
import { useState, useEffect } from "react";

const ProductCard = ({ product, quantity, setQuantity }) => {

  const [user, setUser] = useState(null);
  const [colRef, setColRef] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [productId, setProductId] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  //Reset is added when a new search is performed
  useEffect(() => {
    setIsAdded(false);
    setProductId("");
  }, [product]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        setUser(user);
        const userColRef = collection(db, "users", userId, "products");
        setColRef(userColRef);
      } else {
        setColRef(null);
        setUser(null);
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  
  //Truncate text to avoid overlapping of elements
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };


// Add product to database
const handleAddToList = async (product) => {
  if (!colRef) {
    console.error('User is not logged in or colRef is not set');
    return;
  }
  
  const querySnapshot = await getDocs(colRef);
  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({ ...doc.data(), id: doc.id });
  });

  // check if product already exists
  const productIndex = products.findIndex(p => p.image === product.image);
  if (productIndex !== -1) {
    setIsAdded(false);
    setShowAlert(true); 
    return;
  }

  // add the product if it doesn't exist
  try {
    const docRef = await addDoc(colRef, { ...product, quantity, timestamp: serverTimestamp() });
    setProductId(docRef.id);
    setIsAdded(true);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};




const handleDeleteFromList = async (productId) => {
  if (!colRef) {
    console.error('User is not logged in or colRef is not set');
    return;
  }

  
  if (user) {
    const docRef = doc(db, "users", user.uid, "products", productId);
    try {
      await deleteDoc(docRef);
      setIsAdded(false); 
    } catch (error) {
      console.error(error.message);
    }
  } else {
    console.error('No user is logged in');
  }
};

  
  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 1) {
      setQuantity(parseInt(value));
      props.setQuantity(parseInt(value));
    }
  };
  

  //Toggle button from add to remove
  const handleToggle = () => {
    setIsAdded(!isAdded);
    if (isAdded) {
      handleDeleteFromList(productId);
    } else {
      handleAddToList(product);
    }
  };

  

  return (
    <>
      {showAlert && (
        <Alert sx={{ position: "fixed", top: 68, zIndex: 1, width: "92%", margin: 0, left: 0 }}
          severity="warning" onClose={() => setShowAlert(false)}>
          This product is already in your shopping list
        </Alert>
      )}
      {product && (
        <Card
        id="product-card"
        sx={{
          height: '330px',
          position: 'relative',
        }}>
         
            <CardMedia
              component="img"
              sx={{ maxHeight: "100px", objectFit: "scale-down", mt: "10px" }}
              image={product.image}
              alt={product.description}/>
            <CardContent>
              <Typography
                sx={{
                  lineHeight: 1.2,
                  fontSize: "16px",
                  height: '40px',
                  wordWrap: 'break-word', 
                  overflowWrap: 'break-word',

                }}
                gutterBottom
                variant="h6"
                component="div">
                {truncateText(product.name, 24)}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: 'center',
                  textAlign: "center",
                  
                }}
                >
                <Typography
                  sx={{ fontSize: "22px", lineHeight: 1.2, marginBottom: 0 }}
                  gutterBottom
                  variant="h6"
                  component="div"
                >
                  {`kr ${product.price}`}
                </Typography>
                <IconButton
                  disableTouchRipple
                  disableRipple
                  onClick={handleToggle}
                  sx={{
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    width: "30px",
                    height: '30px',
                    backgroundColor: isAdded ?  'red' : "#4caf50" ,
                    borderRadius: 1,
                    color: "white",
                  }}
                  variant="contained"
                  size="small"
                >
                  {isAdded ? (<RemoveIcon />) : (<AddIcon/>)}
                </IconButton>
              </Box>

              <Typography
                sx={{ fontSize: "14px" }}
                variant="body1"
                color="text.secondary"
              >
                {product.unitPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary"
              sx={{
                wordWrap: 'break-word', 
                overflowWrap: 'break-word',
              }}
              >
                {truncateText(product.description, 30)}
              </Typography>
            </CardContent>
         

          <Box
            sx={{
              position: "absolute",
              width: '100%',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bottom: 15
            }}
          >
            <IconButton
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
              size="small"
              sx={{ minWidth: "32px" }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
            <TextField
              value={quantity}
              onChange={handleQuantityChange}
              size="small"
              type="number"
              inputProps={{ min: "1" }}
              sx={{ width: "52px", mx: "8px"}}
            />
            <IconButton
              onClick={handleIncreaseQuantity}
              size="small"
              sx={{ minWidth: "32px" }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        </Card>
      )}
    </>
  );
};

export default ProductCard
