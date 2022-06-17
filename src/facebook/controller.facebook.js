const { handlePostback, handleMessage  } = require('./utils.facebook');

const getWebHook = (res, req) => {
  let VERIFY_TOKEN = 'oU6gY6iC3tO1kK2sF';
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  
  if (mode && token) {

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
   
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

const postWebHook = (res, req) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
      
      if (webhook_event.message) {
        console.log('here');
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};

module.exports = {
  getWebHook,
  postWebHook
}