function loggedUserIsAdministrator(role) {
  if (role !== 'administrador') {
    return false;
  }

  return true;
}

module.exports = loggedUserIsAdministrator;
