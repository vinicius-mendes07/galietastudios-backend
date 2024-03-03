function scheduleRequestSms({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return `
Sua solicitação de agendamento foi efetuada com sucesso!

Data: ${dateInPortugal}

Hora: ${hourInPortugal}

Serviço: ${service_type}

Aguarde confirmação!

Entraremos em contato assim que seu agendamento for confirmado!
  `;
}

module.exports = scheduleRequestSms;
