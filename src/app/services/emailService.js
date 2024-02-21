const nodemailer = require('nodemailer');

function sendEmail({ subject, message }) {
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

  const mailOptions = {
    from: EMAIL_USER,
    to: 'viniciushenrique43290@gmail.com', // Receber como parametro: email do cliente
    subject,
    text: message,
  };

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Mensagem enviada com sucesso: ', info.messageId);
    }
  });
}

module.exports = sendEmail;
