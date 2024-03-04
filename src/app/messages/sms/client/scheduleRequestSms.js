function scheduleRequestSms({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return `
Solicitacao de agendamento efetuada para ${dateInPortugal}, às ${hourInPortugal}.

Servico: ${service_type}.

Entraremos em contato apos confirmacao!
`;
}

module.exports = scheduleRequestSms;
