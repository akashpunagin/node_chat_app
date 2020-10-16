const path = require('path');
const express = require('express');
// const hbs = require('hbs');

const publicPath = path.join(__dirname, "../public");

var app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
