const formatPhone = require('../../../utils/formatPhone');

function newScheduleSms({
  dateInPortugal,
  hourInPortugal,
  service_type,
  name,
  phone,
}) {
  return `
Novo agendamento!

Data: ${dateInPortugal}
Hora: ${hourInPortugal}
Servico: ${service_type}

Nome: ${name}
Telefone: ${formatPhone(phone)}
`;
}

module.exports = newScheduleSms;
