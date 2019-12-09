import Sequelize from 'sequelize';
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { q: name } = req.query;
    const { id } = req.params;

    if (id) {
      const student = await Student.findByPk(id);
      return res.json(student);
    }

    const users = await Student.findAll({
      where: name
        ? {
            name: Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('name')),
              'LIKE',
              `%${name.toLowerCase()}%`
            ),
          }
        : null,
    });

    return res.json(users);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .positive()
        .integer(),
      weight: Yup.number()
        .required()
        .positive(),
      height: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const student = await Student.findOne({ where: { email: req.body.email } });

    if (student) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, weight, height });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .positive()
        .integer(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const student = await Student.findOne({
      where: { email: req.body.email },
    });

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const { id, name, email, age, weight, height } = await student.update(
      req.body
    );

    return res.json({ id, name, email, age, weight, height });
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ message: 'Student does not exist' });
    }

    await student.destroy();

    return res.sendStatus(200);
  }
}

export default new StudentController();
