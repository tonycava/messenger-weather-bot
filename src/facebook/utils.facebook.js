const request = require('request');
const axios = require('axios');

const handlePostback = (sender_psid, received_postback) => {
  let response;
  let payload = received_postback.payload;
  if (payload === 'GET_STARTED_PAYLOAD') {
    response = { text: 'Welcome ! \n\n Type "help" to get started' };
  }
  callSendAPI(sender_psid, response);
};

const callSendAPI = (sender_psid, response) => {
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
    (err, res, body) => {
      if (!err) console.log('message sent!');
      else console.error('Unable to send message:' + err);
    },
  );
};

const handleMessage = async (sender_psid, received_message) => {
  let response;
  if (received_message.text === 'help') {
    response = {
      text: "I'm here to help you !",
      quick_replies: [
        {
          content_type: 'text',
          title: 'What I can do ?',
          payload: 'RED',
        },
        {
          content_type: 'text',
          title: 'Contact the admin for help',
          payload: 'GREEN',
        },
      ],
    };
  } else {
    const data = await getData();

    response = {
      text: `The weather in toulouse is : ${Math.floor(Number(data) - 273.14)}`,
    };
  }
  callSendAPI(sender_psid, response);
};

const getData = () => {
  return axios
    .get('https://api.openweathermap.org/data/2.5/weather?lat=43.604652&lon=1.444209&appid=e2c0fdbe68fa3660805dd3e03cc2d8e4')
    .then(({ data }) => data.main.temp);
};

module.exports = {
  callSendAPI,
  handlePostback,
  handleMessage,
};