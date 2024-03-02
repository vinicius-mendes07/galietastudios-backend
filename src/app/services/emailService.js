const nodemailer = require('nodemailer');

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  pool: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

function sendEmail({ subject, message }) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: EMAIL_USER,
      to: ['vinicius.henrique.92@hotmail.com', 'viniciushenrique43290@gmail.com'], // Receber como parametro: email do cliente
      subject,
      html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = sendEmail;
