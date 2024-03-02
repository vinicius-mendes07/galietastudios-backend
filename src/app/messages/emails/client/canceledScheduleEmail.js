const defaultEmail = require('../defaultEmail');

function canceledScheduleEmail({ dateInPortugal, hourInPortugal }) {
  return defaultEmail(`
  <h1>
    <span>Infelizmente, seu agendamento para</span>
    <span>a data ${dateInPortugal} as ${hourInPortugal}</span>
    <span>foi cancelado.</span>
  </h1>

    <p>Você pode fazer um novo agendamento no nosso site: <br> https://galieta-barbershop.com/agendar</p>
  `);
}

module.exports = canceledScheduleEmail;
