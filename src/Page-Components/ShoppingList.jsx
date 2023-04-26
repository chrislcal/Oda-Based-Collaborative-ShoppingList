import { useState, useEffect } from "react";
import { colRef, db } from "../App";
import { getDocs, deleteDoc, doc, orderBy, query, onSnapshot} from "firebase/firestore";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { animated, useTransition } from "react-spring";

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [checkedItemId, setCheckedItemId] = useState(null);
  const [itemsToRemove, setItemsToRemove] = useState([]);

  const q = query(colRef, orderBy('createdAt'))

  useEffect(() => {
    // Set up the onSnapshot listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let products = [];
      snapshot.docs.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id, checked: false });
      });
      setItems(products);
    });
  
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
  

  const handleDeleteFromList = async (product) => {
    const docRef = doc(db, "Varer", product.id);
    try {
      await deleteDoc(docRef);
      setItems((prevItems) => prevItems.filter((i) => i.id !== product.id));
    } catch (error) {
      console.error(error.message);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleCheckButtonClick = async (item) => {
    const docRef = doc(db, "Varer", item.id);
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
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return totalPrice.toFixed(2);
  };
  

  const transitions = useTransition(items, {
    keys: (item) => item.id,
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: 86 },
    leave: { opacity: 0, height: 0 },
    config: { tension: 200, friction: 20 },
  });

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
        key={item.id}
        elevation={1}
        sx={{
          display: "flex",
          width: "95%",
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
            {truncateText(item.name, 20)}
          </Typography>
          <Typography variant="body2" lineHeight={2}>
            {truncateText(item.description, 20)}
          </Typography>
          <Typography variant="h6" sx={{ marginTop: "auto", lineHeight: 0.9 }}>
            {`kr ${item.price}`}
          </Typography>
          <Typography variant="body1">{item.unitprice}</Typography>
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
      <Box
        sx={{
          width: "100%",
          height: 70,
          top: 0,
          position: "fixed",
          zIndex: 1,
          backgroundColor: "primary.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Array.isArray(items) && items.length > 0 && (
          <Box width="60%" display="flex" justifyContent="space-between">
            <Typography color="white" variant="h5" lineHeight={1}>
            {`Totalt: ${calculateTotalPrice(items)} kr`}
            </Typography>
            <Typography color='white' variant='h5' lineHeight={1}>
            {`Valgt: `}
            </Typography>
          </Box>
        )}
      </Box>
      {items.length > 0 ? (
        displayedProducts
      ) : (
        <Box position="relative" mt="55%">
          <Typography variant="h4" gutterBottom color="rgba(0,0,0,0.2)">
            Ingen varer
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ShoppingList;
