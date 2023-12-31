const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const ShortUrl = require('./models/shortUrl');
const shortid = require('shortid');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const generateShortUrlKey = () => {
  return shortid.generate();
};

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  const inputValue = req.body.fullUrl;

  try {
    const response = await axios(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(inputValue)}`);
    const shortUrl = response.data.result.full_short_link;
    await ShortUrl.create({ fullUrl: inputValue, shortUrl });
  } catch (error) {
    console.error('Error creating short URL:', error);
  }

  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.fullUrl);
});

app.delete('/delete/:id', async (req, res) => {
  try {
    await ShortUrl.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
