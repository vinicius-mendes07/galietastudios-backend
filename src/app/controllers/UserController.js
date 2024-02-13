const UserRepository = require('../repositories/UserRepository');
const isValidUUID = require('../utils/isValidUUID');

class UserController {
  async index(req, res) {
    const users = await UserRepository.findAll();

    res.json(users);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const user = await UserRepository.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  }

  async store(req, res) {
    const {
      name, phone, email, password,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });

    const role = 'administrador';
    // pegar o valor de role da requisição na atualização de novos colaboradores

    // if (!role) return res.status(400).json({ error: 'role is required' });
    // role tem que ser 'administrador' ou 'colaborador'

    const userExists = await UserRepository.findByEmail(email);

    if (userExists) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    const user = await UserRepository.create({
      name,
      phone,
      email,
      password,
      role,
    });

    res.status(201).json(user);
  }
}

module.exports = new UserController();
