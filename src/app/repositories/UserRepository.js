const db = require('../../database');

class UserRepository {
  async findAll() {
    const rows = await db.query('SELECT * FROM users ORDER BY name');

    return rows;
  }

  async findById(id) {
    const [row] = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    return row;
  }

  async create({
    name, phone, email, password, role,
  }) {
    const [row] = await db.query(`
    INSERT INTO users(name, phone, email, password, role)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `, [name, phone, email, password, role]);

    return row;
  }

  async update(id, {
    name,
    phone,
    email,
    password,
    role,
  }) {
    const [row] = await db.query(`
      UPDATE users
      SET name = $1, phone = $2, email = $3, password = $4, role = $5
      WHERE id = $6
      RETURNING *
    `, [name, phone, email, password, role, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM users WHERE id = $1', [id]);

    return deleteOp;
  }
}

module.exports = new UserRepository();
