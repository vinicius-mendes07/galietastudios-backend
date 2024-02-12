const db = require('../../database');

class ServiceRepository {
  async findAll() {
    const rows = await db.query('SELECT * FROM services ORDER BY service_type');

    return rows;
  }

  async findById(id) {
    const [row] = await db.query('SELECT * FROM services where id = $1', [id]);

    return row;
  }

  async create({ service_type, duration }) {
    const [row] = await db.query(`
      INSERT INTO services(service_type, duration)
      VALUES($1, $2)
      RETURNING *
    `, [service_type, duration]);

    return row;
  }

  async update(id, { service_type, duration }) {
    const [row] = await db.query(`
      UPDATE services
      SET service_type = $1, duration = $2
      WHERE id = $3
      RETURNING *
    `, [service_type, duration, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM services WHERE id = $1', [id]);

    return deleteOp;
  }
}

module.exports = new ServiceRepository();
