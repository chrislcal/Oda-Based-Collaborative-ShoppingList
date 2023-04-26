import axios from "axios";
import { useRef, useState, useEffect } from "react";


import ProductCard from "../components/ProductCard";

import searchLogo from '../resources/images/search.png';

import { Pagination, Box, Button, TextField, Typography } from "@mui/material";



function Search() {
  const searchRef = useRef("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState("");
  const [lastPageNum, setLastPageNum] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);


  const getData = async (resetPageIndex = false) => {
    const pageIndex = resetPageIndex ? 1 : currentPage;
    try {
      const response = await axios.get(
        `http://localhost:3000/scrape?q=${searchRef.current.value}&page=${pageIndex}`
      );

      setProducts(response.data[1]);
      console.log(response.data[1]);
      setLastPageNum(response.data[0]);

      if (resetPageIndex) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage, searchRef.current.value]);

  let displayedProduct;
  if (products) {
    displayedProduct = products.map((product, index) => {
      return (<ProductCard product={product} key={index}/>)
    })
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
          sx={{ mr: 2, p: 0.85, textAlign: 'center', borderColor: 'rgba(255, 255, 255, 0.6)', color: 'rgba(255, 255, 255, 0.6)'}}
          variant="outlined"
          size="medium"
          onClick={ async () => {
            await getData(true);
            setSearchPerformed(true);
            window.scrollTo({top: 0});
          }}
          >
          Søk

        </Button>
      </Box>

      <Box
  className="products-container"
  bgcolor="#ECF2FF"
  pt="90px"
  width="calc(100% - 20px)"
  marginLeft="auto"
  marginRight="auto"
  display="flex"
  alignItems="center"
  flexWrap="wrap"
  gap="10px"
  pb="10px"
>
  {!searchPerformed && (
    <Box className="search-logo">
      <img src={searchLogo} alt="Search Logo" />
    </Box>
  )}
  {searchPerformed && (
    products && products.length > 0 ? displayedProduct : (
      Array.isArray(products) ? (
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
