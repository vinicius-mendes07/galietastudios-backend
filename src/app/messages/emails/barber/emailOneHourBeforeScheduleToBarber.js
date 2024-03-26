const formatPhone = require('../../../utils/formatPhone');
const defaultEmail = require('../defaultEmail');

function emailOneHourBeforeScheduleToBarber({
  dateInPortugal,
  hourInPortugal,
  service_type,
  client_name,
  client_phone,
  client_email,
}) {
  return defaultEmail(`
  <h1>
    <span>Você tem um agendamento</span>
    <span>marcado em uma hora.</span>
  </h1>

  <p>Data: ${dateInPortugal}</p>
  <p>Hora: ${hourInPortugal}</p>
  <p>Serviço: ${service_type}</p>
  <p>Nome: ${client_name}</p>
  <p>Telefone: ${formatPhone(client_phone)}</p>
  <p>Email: ${client_email}</p>
  `);
}

module.exports = emailOneHourBeforeScheduleToBarber;
