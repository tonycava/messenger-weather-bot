const express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

const axios = require('axios');
const request = require('request');

function callSendAPI(sender_psid, response) {
  const request_body = {
    get_started: {
      payload: 'GET_STARTED_PAYLOAD',
    },
    greeting: [
      {
        locale: 'default',
        text: 'Hello {{user_first_name}}!',
      },
    ],
    recipient: {
      id: sender_psid,
    },
    messaging_type: 'RESPONSE',
    message: response,
  };

  request(
    {
      uri: 'https://graph.facebook.com/v14.0/me/messages',
      qs: {
        access_token:
          'EAAvOOplsX2IBAJMdwZAInTQSs0Hrcs1rtFRRn5HMevGEywWNyaPc86YBKky8aCRXpq7cqdU8S1AfqfWcIIPoo9vKZBwOPoHHM0cZAg7qJwdVyGsKQlEVVRlqpj5qafNFkL9Rh8xmpBFDCW93znrU67aMWvBQlr8ZCflSRCZAYAKmHitXPOql2',
      },
      method: 'POST',
      json: request_body,
    },
    // eslint-disable-next-line no-unused-vars
    (err, res, body) => {
      if (!err) console.log('message sent!');
      else console.error('Unable to send message:' + err);
    },
  );
}

async function handleMessage(sender_psid, received_message) {
  let response;
  if (received_message.text === 'help') {
    response = {
      text: 'Pick a color:',
      quick_replies: [
        {
          content_type: 'text',
          title: 'Red',
          payload: 'RED',
        },
        {
          content_type: 'text',
          title: 'Green',
          payload: 'GREEN',
        },
      ],
    };
  } else {
    let data = await axios
      .get(
        'https://api.openweathermap.org/data/2.5/weather?lat=43.604652&lon=1.444209&appid=e2c0fdbe68fa3660805dd3e03cc2d8e4',
      )
      .then((res) => res.data.main.temp);
    console.log(data);
    response = {
      text: `You sent the message: "${received_message.text}"., ${
        Number(data) - 273.14
      } Now send me an image!`,
    };
  }
  callSendAPI(sender_psid, response);
}

handleMessage('ddd', 'ff');

// eslint-disable-next-line no-unused-vars
function handlePostback(sender_psid, received_postback) {
  console.log('postback');
  let response;
  let payload = received_postback.payload;

  console.log(payload);
  if (payload === 'GET_STARTED_PAYLOAD') {
    console.log('in');
    response = { text: 'Welcome !' };
  }
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
// eslint-disable-next-line no-unused-vars,no-redeclare
app.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        console.log('here');
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

app.get('/', (req, res) => {
  res.send('kkkk');
});

app.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = 'oU6gY6iC3tO1kK2sF';

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
