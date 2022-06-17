import express from "express"
import routeFacebook from './facebook/route.facebook';

const app = express()
app.use(express.json())

routeFacebook.get('/webhook')

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
