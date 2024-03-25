const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserRepository = require('../repositories/UserRepository');

const loggedUserIsAdministrator = require('../utils/loggedUserIsAdministrator');
const isValidUUID = require('../utils/isValidUUID');

class UserController {
  async index(req, res) {
    const users = await UserRepository.findAll();

    res.json(users);
  }

  async show(req, res) {
    const { id } = req.params;
    const loggedUser = req.user;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    if (loggedUser.id !== id && !loggedUserIsAdministrator(loggedUser.role)) {
      return res.status(403).json({ error: 'Permission denied' });
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

    const userExists = await UserRepository.findByEmail(email);

    if (userExists) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await UserRepository.create({
      name,
      phone,
      email,
      password: hash,
      role: 'administrador', // role must be 'administrador' or 'colaborador' - pegar da req
    });

    res.status(201).json(user);
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await UserRepository.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SECRET, { expiresIn: '30m' });

    res.json({ token });
  }

  async update(req, res) {
    const loggedUser = req.user;

    const {
      name, phone, email, newPassword,
    } = req.body;

    if (!isValidUUID(loggedUser.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!phone) return res.status(400).json({ error: 'Phone is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const userExists = await UserRepository.findById(loggedUser.id);

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userByEmail = await UserRepository.findByEmail(email);

    if (userByEmail && userByEmail.id !== loggedUser.id) {
      return res.status(400).json({ error: 'This email is already in use' });
    }

    let hash = '';

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(newPassword, salt);
    } else {
      hash = null;
    }

    const user = await UserRepository.update(loggedUser.id, {
      name,
      phone,
      email,
      password: hash,
      role: 'administrador', // role must be 'administrador' or 'colaborador' - pegar da req
    });

    return res.json(user);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    await UserRepository.delete(id);

    res.sendStatus(204);
  }
}

module.exports = new UserController();
