const defaultEmail = require('../defaultEmail');

function emailOneHourBeforeScheduleToClient({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return defaultEmail(`
  <h1>
    <span>Seu agendamento é em uma hora,</span>
    <span>não se esqueça!</span>
  </h1>

  <p>Data: ${dateInPortugal}</p>
  <p>Hora: ${hourInPortugal}</p>
  <p>Serviço: ${service_type}</p>
  `);
}

module.exports = emailOneHourBeforeScheduleToClient;
