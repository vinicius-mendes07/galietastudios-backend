const defaultEmail = require('../defaultEmail');

function scheduleRequestEmail({
  dateInPortugal,
  hourInPortugal,
  service_type,
}) {
  return defaultEmail(`
  <h1>
    <span>Sua solicitação de agendamento</span>
    <span>foi efetuada com</span>
    <span>sucesso!</span>
  </h1>

  <p>Data: ${dateInPortugal}</p>

  <p>Hora: ${hourInPortugal}</p>

  <p>Serviço: ${service_type}</p>

  <p>Aguarde confirmação!</p>

  <p>Entraremos em contato assim que seu agendamento for confirmado!</p>
  `);
}

module.exports = scheduleRequestEmail;
