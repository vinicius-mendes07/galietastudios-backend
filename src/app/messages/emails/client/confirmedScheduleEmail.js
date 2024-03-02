const defaultEmail = require('../defaultEmail');

function confirmedScheduleEmail({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return defaultEmail(`
  <h1>
    <span>Prepare-se para ficar ainda mais estiloso!</span>
    <span>Seu horário foi confirmado!</span>
  </h1>

  <p>Data: ${dateInPortugal}</p>

  <p>Hora: ${hourInPortugal}</p>

  <p>Serviço: ${service_type}</p>
  `);
}

module.exports = confirmedScheduleEmail;
