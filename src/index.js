const express = require('express')
const routeFacebook = require('./facebook/route.facebook');

const app = express();
app.use(express.json());

routeFacebook.get('/webhook');

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
