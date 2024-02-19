function getCurrentDate() {
  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);

  const ISODate = currentDate.toISOString();

  const dateOnly = ISODate.split('T')[0];

  return dateOnly;
}

module.exports = getCurrentDate;
