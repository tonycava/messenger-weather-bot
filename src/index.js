const express = require('express')
const routeFacebook = require('./facebook/route.facebook');
const dotenv = require("dotenv").config()

const app = express();
app.use(express.json());

app.use('/webhook', routeFacebook);

app.get('/', (req, res) => {
  res.send('la')
})

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
