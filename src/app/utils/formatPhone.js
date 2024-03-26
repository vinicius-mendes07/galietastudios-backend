function formatPhone(phoneNumber) {
  // mudar para formato de portugal
  return phoneNumber
    .replace(/\D/g, '')
    .replace(/^(\d{2})\B/, '($1) ')
    .replace(/(\d{1})?(\d{4})(\d{4})/, '$1$2-$3');
}

module.exports = formatPhone;
