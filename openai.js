// openai.js
const axios = require("axios");
require("dotenv").config();

const openaiAPI = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

module.exports = openaiAPI;