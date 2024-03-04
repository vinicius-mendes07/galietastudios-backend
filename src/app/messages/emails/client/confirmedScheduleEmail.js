const defaultEmail = require('../defaultEmail');

function confirmedScheduleEmail({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return defaultEmail(`
  <h1>
    Seu horário foi confirmado!
  </h1>

  <p>Data: ${dateInPortugal}</p>

  <p>Hora: ${hourInPortugal}</p>

  <p>Serviço: ${service_type}</p>
  `);
}

module.exports = confirmedScheduleEmail;
