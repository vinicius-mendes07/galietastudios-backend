// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const number = process.env.TWILIO_NUMBER;

const testAccountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
const testAuthToken = process.env.TWILIO_TEST_AUTH_TOKEN;
const testNumber = process.env.TWILIO_TEST_NUMBER;

const client = require('twilio')(testAccountSid, testAuthToken);

function sendSms(messageBody) { // receber numero do usuario como parametro
  client.messages
    .create({
      body: messageBody,
      from: testNumber,
      to: '+5566996796020',
    })
    .then((message) => console.log(message))
    .catch((error) => console.log(error));
}

module.exports = sendSms;
