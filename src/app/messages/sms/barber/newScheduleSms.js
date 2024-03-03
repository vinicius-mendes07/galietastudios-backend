function newScheduleSms({
  dateInPortugal,
  hourInPortugal,
  service_type,
  name,
  phone,
  email,
}) {
  return `
Há um cliente solicitando agendamento!

Data: ${dateInPortugal}

Hora: ${hourInPortugal}

Serviço: ${service_type}

Nome: ${name}
Telefone: ${phone}
Email: ${email}
  `;
}

module.exports = newScheduleSms;
