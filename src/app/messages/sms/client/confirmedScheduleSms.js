function confirmedScheduleSms({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return `
Seu horario foi confirmado!

Data: ${dateInPortugal}

Hora: ${hourInPortugal}

Servico: ${service_type}
`;
}

module.exports = confirmedScheduleSms;
