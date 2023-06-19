
// Ract imports
import { useState, useEffect, useMemo } from "react";

//Firabase Imports
import { db } from "../firebaseConfig";
import { useAuth } from "../AuthContext";
import {
  getDocs, deleteDoc, doc,
  orderBy, query, onSnapshot,
  collection, updateDoc } from "firebase/firestore";

//Material UI Imports
import { Box, Typography, Paper, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

//React Spring imports 
import { animated, useTransition, useSpring } from "react-spring";

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [checkedItemId, setCheckedItemId] = useState(null);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  

  //React Spring
  const [boxProps, setBoxProps] = useSpring(() => ({ translateY: 0 }));

 
  
  useEffect(() => {
    if (!items.length) {
      setBoxProps({ translateY: -100 });
    } else {
      setBoxProps({ translateY: 0 });
    }
  }, [items, setBoxProps]);
  
  const { userId, isLoading } = useAuth();

  const colRef = useMemo(() => collection(db, "users", userId, "products"), [db, userId]);
  const q = query(colRef, orderBy("timestamp"));

  useEffect(() => {
    if (!colRef) return;
  
    // Set up the onSnapshot listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let products = [];
      snapshot.docs.forEach((doc) => {
        products.push({ 
          ...doc.data(), 
          id: doc.id, 
          checked: false, 
          quantity: doc.data().quantity || 1  
        });
      });
      setItems(products);
    });
  
  
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [colRef]);
  

  
  


  //Shorten length of visible text to not collide 
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  //Handle item removal from list and db
  const handleCheckButtonClick = async (item) => {
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }
    const docRef = doc(db, "users", userId, "products", item.id);
    try {
      await deleteDoc(docRef);
      setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
      setCheckedItemId(item.id);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleExited = (item) => {
    setItemsToRemove((items) => [...items, item]);
    setCheckedItemId(null);
  };

  useEffect(() => {
    if (itemsToRemove.length > 0) {
      setItems((items) =>
        items.filter((item) => !itemsToRemove.includes(item))
      );
      setItemsToRemove([]);
    }
  }, [itemsToRemove]);


  const calculateTotalPrice = (items) => {
  const totalPrice = items.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );
  return totalPrice.toFixed(2);
};
  

  //Handle decrement quantity 
  const handleDecrement = async (item) => {
    if(!userId) {
      console.error('User is not authenticated');
      return;
    }
    if(item.quantity === 0) {
      return;
    }
    const docRef = doc(db, 'users', userId, 'products', item.id);
    try {
      const newQuantity = item.quantity - 1;
      await updateDoc(docRef, {
        quantity: newQuantity,
      });
  
      setItems((items) => items.map((i) => 
        i.id === item.id ? {...i, quantity: newQuantity} : i)
      );
  
    } catch (error) {
      console.error(error.message);
    }
  };

  //Handle increment quantity
  const handleIncrement = async (item) => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }
    const docRef = doc(db, 'users', userId, 'products', item.id);
    try {
      const newQuantity = item.quantity + 1;
      await updateDoc(docRef, {
        quantity: newQuantity,
      });
  
      setItems((items) => items.map((i) => 
        i.id === item.id ? {...i, quantity: newQuantity} : i)
      );
  
    } catch (error) {
      console.error(error.message);
    }
  };


  //Defining animation transitions 
  const transitions = useTransition(items, {
    keys: (item) => item.id,
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 86 },
    leave: { opacity: 0, height: 0 },
    config: { tension: 200, friction: 20 },
  });
  

  //Defining look and behavior of listed items 
  const displayedProducts = transitions((style, item) => (
    <animated.div
      key={item.id}
      style={{
        ...style,
        width: "100%",
        marginBottom: "3px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        id='paper'
        key={item.id}
        elevation={1}
        sx={{
          display: "flex",
          height: "80px",
          margin: "3px",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "70px",
            display: "flex",
            alignItems: "center",
            margin: "10px",
          }}
        >
          <img style={{ height: "100%" }} src={item.image} alt={item.name} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Typography variant="body1" lineHeight={1}>
            {truncateText(item.name, 8)}
          </Typography>
          <Typography variant="body2" lineHeight={2}>
            {truncateText(item.description, 10)}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: "auto", lineHeight: 0.9 }}>
            {`kr ${(item.price * item.quantity).toFixed(2)}`}
          </Typography>
          <Typography variant="body1">{item.unitprice}</Typography>
        </Box>
        <Box 
          display="flex"
          m={0} p={0}
          width='100px'
          alignItems='center'
          justifyContent='center'
          >
          <IconButton onClick={() => handleDecrement(item)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <Typography>{item.quantity}</Typography>
          <IconButton onClick={() => handleIncrement(item)}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>

        <Box
          backgroundColor="#4caf50"
          height="100%"
          display="flex"
          alignItems="center"
          borderRadius="inherit"
          sx={{
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          }}
        >
          <IconButton
            variant="contained"
            sx={{
              height: "60px",
              width: "70px",
              backgroundColor: "#4caf50",
              borderRadius: 0,
              color: "white",
            }}
            onClick={() => handleCheckButtonClick(item)}
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </Paper>
    </animated.div>
  ));


  return (
    !isLoading && (
    <Box
      sx={{
        display: "flex",
        marginTop: 10,
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
      }}
    >
      <animated.div
        style={{
          transform: boxProps.translateY.to(
            (value) => `translateY(${value}px)`
          ),
          width: "100%",
          height: 70,
          top: 0,
          position: "fixed",
          zIndex: 1,
          backgroundColor: "#655DBB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Array.isArray(items) && items.length > 0 && (
          <Box 
            borderRadius={1}
            bgcolor='primary.light'
            width="100%"
            height='50%'
            m={0.5}
            p={1.5}
            gap={2}
            display="flex" 
            justifyContent="flex-start"
            alignItems='center'>
            <Typography color="white" variant="subtitle1" lineHeight={1}>
              Totalt kr
            </Typography>
            <Typography color="white" variant="h5" lineHeight={1}>
              {calculateTotalPrice(items)}
            </Typography>
          </Box>
        )}
      </animated.div>
      {items.length > 0 ? (
        displayedProducts
      ) : (
        <Box position="relative" mt="15%">
          <Typography variant="h4" gutterBottom color="rgba(0,0,0,0.2)">
            Ingen varer
          </Typography>
        </Box>
      )}
    </Box>
  ))
};

export default ShoppingList;
