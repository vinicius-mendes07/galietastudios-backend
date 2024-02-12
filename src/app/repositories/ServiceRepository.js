const db = require('../../database');

class ServiceRepository {
  async findAll() {
    const rows = await db.query('SELECT * FROM services ORDER BY service_type');

    return rows;
  }

  async create({ service_type, duration }) {
    const [row] = await db.query(`
      INSERT INTO services(service_type, duration)
      VALUES($1, $2)
      RETURNING *
    `, [service_type, duration]);

    return row;
  }
}

module.exports = new ServiceRepository();
