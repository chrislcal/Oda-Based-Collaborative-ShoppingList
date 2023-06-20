const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/scrape', async (req, res) => {
  
  const searchString = req.query.q || '';
  const pageIndex = req.query.page || '';

  try {
      const response = await axios.get(`https://oda.com/no/search/?page=${pageIndex}&q=${searchString}`);
      
      const html = response.data;
      const $ = cheerio.load(html);
      const products = [];

      const lastPageHref = $('.pagination li:nth-last-child(2) a').attr('href');
      const lastPageNum = lastPageHref ? Number(lastPageHref.match(/page=(\d+)/)[1]) : 1;

      $('.search-results > .col-xs-6').each((i, el) => {
          const name = $(el).find('.name-main').text().trim();
          const description = $(el).find('.name-extra').text().trim();
          const priceText = $(el).find('.label-price, .undiscounted-price').text().trim(); 
          const priceNum = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
          const price = priceNum.toFixed(2);
          const unitPrice = $(el).find('.unit-price').text().trim() || '';
          const image = $(el).find('.image-container img').attr('src');

  
          const product = { name, description, price, unitPrice, image };
          products.push(product);
        });
  
      res.send([lastPageNum, products]);
    } catch (error) {
      res.status(500).send(error.message);
      console.log(error.message);
    }
  });

exports.app = functions.https.onRequest(app);
