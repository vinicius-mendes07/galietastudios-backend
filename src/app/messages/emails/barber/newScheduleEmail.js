const formatPhone = require('../../../utils/formatPhone');
const defaultEmail = require('../defaultEmail');

function newScheduleEmail({
  dateInPortugal,
  hourInPortugal,
  service_type,
  name,
  phone,
  email,
}) {
  return defaultEmail(`
  <h1>
    Há um cliente solicitando agendamento!
  </h1>

  <p>Data: ${dateInPortugal}</p>

  <p>Hora: ${hourInPortugal}</p>

  <p>Serviço: ${service_type}</p>

  <p>Nome: ${name}</p>
  <p>Telefone: ${formatPhone(phone)}</p>
  <p>Email: ${email}</p>
  `);
}

module.exports = newScheduleEmail;
