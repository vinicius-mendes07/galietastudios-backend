const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const number = process.env.TWILIO_NUMBER;
const client = require('twilio')(accountSid, authToken);

function sendMessage(messageBody) { // receber numero do usuario como parametro
  client.messages
    .create({
      body: messageBody,
      from: number,
      to: '+5566996796020',
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.log(error));
}

module.exports = sendMessage;
