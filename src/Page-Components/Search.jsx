import '../styles/style.css'

import axios from "axios";
import { useRef, useState, useEffect } from "react";


import ProductCard from "../components/ProductCard";

import searchLogo from '../resources/images/search.png';

import { Pagination, Box, Button, TextField, Typography } from "@mui/material";



function Search() {

  const searchRef = useRef("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [lastPageNum, setLastPageNum] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [quantities, setQuantities] = useState({});


  const getData = async (resetPageIndex = false) => {
    const pageIndex = resetPageIndex ? 1 : currentPage;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/scrape?q=${searchRef.current.value}&page=${pageIndex}`
      );
    
      setQuantities({});
      setProducts(response.data[1].length > 0 ? response.data[1] : []);
      setLastPageNum(response.data[0]);
    
      if (resetPageIndex) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error(error.message);
    }
    setIsLoading(false);
  };
  
  
  useEffect(() => {
    getData();
  }, [currentPage, searchRef.current.value]);

  let displayedProduct;
  if (products) {
    displayedProduct = products.map((product) => {
      const productId = product.image;
      return (
        <ProductCard
          product={product}
          key={productId}
          quantity={quantities[productId] || 1}
          setQuantity={(newQuantity) => {
            setQuantities(prevQuantities => {
              return {...prevQuantities, [productId]: newQuantity };
            });
          }}
        />
      );
    });
  }

  

  const handleChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0});
  }
  

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between">

      <Box
        position="fixed"
        bgcolor="primary.dark"
        zIndex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="10vh"
        width="100%"
        top='0'
        color="primary.contrastText"
        >
        
        <Box  width='600px' display='flex'>
        <TextField
          fullWidth
          InputLabelProps={{
            sx: {
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-focused': {
                color: 'white',
              }
            },
          }}
          inputProps={{style: {color: 'white'}}}
          sx={{ mr: 2, ml: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }}
          variant="outlined"
          label="Søk etter varer"
          size="small"
          inputRef={searchRef}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              getData(true);
              setSearchPerformed(true);
            }
          }}
          />
          
        <Button
          sx={{
             mr: 2, 
             p: 0.85,
             textAlign: 'center',
             borderColor: 'rgba(255, 255, 255, 0.6)',
             color: 'rgba(255, 255, 255, 0.6)'
            }}

            variant="outlined"
            size="medium"
            onClick={ async () => {
            setQuantities({});
            await getData(true);
            setSearchPerformed(true);
            window.scrollTo({top: 0});
          }}
          >
          Søk
        </Button>
        </Box>
      </Box>

      <Box
        className="products-container"
        bgcolor="#ECF2FF"
        pt="90px"
        width='90%'
        marginLeft="auto"
        marginRight="auto"
        display="flex"
        alignItems="center"
        alignContent='center'
        justifyContent='center'
        flexWrap="wrap"
        gap="10px"
        pb="10px"
      >
  {!searchPerformed && (
    <Box className="search-logo" sx={{position: 'relative', margin: '0 auto', top: '200px'}}>
      <img src={searchLogo} alt="Search Logo" style={{width: '200px'}}/>
    </Box>
  )}
  {searchPerformed && (
  isLoading ? <Typography variant="h4" sx={{ color: "#9398a3" }}>
            Loading...
          </Typography> : (
    products && products.length > 0 ? displayedProduct : (
      products.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "70vh",
          }}
        >
          <Typography variant="h4" sx={{ color: "#9398a3" }}>
            Ingen treff...
          </Typography>
        </Box>
      ) : null
    )
  )
)}

</Box>


      <Box
        sx={{
          mb: '80px',
          mt: '20px',
          p: 0,
          height: "40px",
          width: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#ECF2FF'
        }}
      >
        {lastPageNum && products && products.length > 0 && 
        <Pagination 
          size="medium"
          count={lastPageNum}
          page={currentPage}
          color="primary"
          onChange={handleChange}
          />}
      </Box>
    </Box>
  );
}

export default Search;
