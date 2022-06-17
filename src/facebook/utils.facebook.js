import request from 'request';
import axios from 'axios';

export const handlePostback = (sender_psid, received_postback) => {
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

export const callSendAPI = (sender_psid, response) => {
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
    }
  );
}

export const handleMessage = async (sender_psid, received_message) => {
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
    let data = getData()
    console.log(data);
    
    response = {
      text: `You sent the message: "${received_message.text}"., ${
        Number(data) - 273.14
      } Now send me an image!`,
    };
  }
  callSendAPI(sender_psid, response);
}

const getData = async () => {
  return await axios
    .get(
      'https://api.openweathermap.org/data/2.5/weather?lat=43.604652&lon=1.444209&appid=e2c0fdbe68fa3660805dd3e03cc2d8e4'
    )
    .then((res) => res.data.main.temp);
}