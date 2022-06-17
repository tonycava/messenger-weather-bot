const request = require('request');
const axios = require('axios');

const handlePostback = (sender_psid, received_postback) => {
  let response;
  let payload = received_postback.payload;
  if (payload === 'GET_STARTED_PAYLOAD') {
    response = { text: 'Welcome ! \n\nType "help" to get started' };
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
    }, (err, res, body) => {
      if (!err) console.log('message sent!');
      else console.error('Unable to send message:' + err);
    },
  );
};

const handleMessage = async (sender_psid, received_message) => {
  let response;
  const content = received_message.text.toUpperCase().split(' ')

  if (received_message.text.toUpperCase() === 'HELP') {
    response = {
      text: 'I\'m here to help you !',
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
    callSendAPI(sender_psid, response);
  } else if (content[0] === 'WEATHER' && content[1] === undefined || content[1] === '') {

    console.log("without")


    const data = await getData();
    response = {
      text: `The weather in toulouse is : ${Math.floor(Number(data))}`,
    };
    callSendAPI(sender_psid, response);
  } else if (content[0] === 'WEATHER' && content[1] !== '') {

    console.log("with")

    let query = '';
    for (let i = 1; i < content.length; i++) {
      query += content[1] + ' ';
    }
    query = query.trim()
    console.log(query, "query")
    let data = getData(query)
    response = {
      text: `The weather in ${query} is : ${Math.floor(Number(data))}`,
    };
    callSendAPI(sender_psid, response);
  } else {
    console.log("no")
    response = {
      text: `No city found`,
    };

    callSendAPI(sender_psid, response);
  }
};

const getData = (city = 'Toulouse') => {
  console.log(city)
  console.log(`http://api.weatherstack.com/current?access_key=${process.env.API_KEY}&query=${city}`)
  return axios
    .get(`http://api.weatherstack.com/current?access_key=${process.env.API_KEY}&query=${city}`)
    .then(({ data }) => data.current.temperature);
};

module.exports = {
  callSendAPI,
  handlePostback,
  handleMessage,
};