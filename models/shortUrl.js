const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
