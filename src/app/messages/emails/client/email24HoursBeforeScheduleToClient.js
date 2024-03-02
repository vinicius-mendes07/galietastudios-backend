const defaultEmail = require('../defaultEmail');

function email24HoursBeforeScheduleToClient({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return defaultEmail(`
  <h1>
    <span>Seu agendamento é amanhã,</span>
    <span>não se esqueça!</span>
  </h1>

  <p>Data: ${dateInPortugal}</p>
  <p>Hora: ${hourInPortugal}</p>
  <p>Serviço: ${service_type}</p>
  `);
}

module.exports = email24HoursBeforeScheduleToClient;
