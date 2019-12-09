import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

import Queue from '../../lib/Queue';
import NewRegistrationMail from '../jobs/NewRegistrationMail';

class RegistrationController {
  async index(req, res) {
    const { id } = req.params;

    if (id) {
      const registration = await Registration.findByPk(id);
      return res.json(registration);
    }

    const registrations = await Registration.findAll({
      attributes: [
        'id',
        'plan_id',
        'student_id',
        'start_date',
        'end_date',
        'price',
        'active',
      ],
      include: [
        { model: Student, as: 'student' },
        { model: Plan, as: 'plan' },
      ],
    });

    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      student_id: Yup.number().positive(),
      plan_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { start_date, student_id, plan_id } = req.body;

    let student = null;

    if (student_id) {
      student = await Student.findByPk(student_id);

      if (!student) {
        return res.status(400).json({ error: 'Student does not exist' });
      }
    }

    let newPlan = null;

    if (plan_id) {
      newPlan = await Plan.findByPk(plan_id);

      if (!newPlan) {
        return res.status(400).json({ error: 'Plan does not exist' });
      }
    }

    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration does not exist' });
    }

    /**
     * Trying to update registration to another student_id
     */
    if (student && registration.student_id !== student.id) {
      /**
       * One student can't have two plans
       */
      const studentAlreadyHasPlan = await Registration.findOne({
        where: { student_id },
      });

      if (studentAlreadyHasPlan) {
        return res.status(400).json({ error: 'Student already has a plan' });
      }
    }

    const newRegistration = { start_date, student_id, plan_id };

    /**
     * New plan not provided,
     * search for previous plan
     */
    if (!newPlan) {
      newPlan = await Plan.findByPk(registration.plan_id);

      if (!newPlan) {
        return res.status(400).json({
          error: "No previous plan, can't calculate price and duration",
        });
      }
    }

    /**
     * User wants to update start_date of registration
     */
    if (start_date) {
      newRegistration.end_date = addMonths(
        parseISO(start_date),
        newPlan.duration
      );
      newRegistration.price = newPlan.price * newPlan.duration;
    }

    if (plan_id) {
      newRegistration.price = newPlan.price * newPlan.duration;
    }

    const {
      id,
      student_id: new_student_id,
      plan_id: new_plan_id,
      start_date: new_start_date,
      end_date,
      price,
    } = await registration.update(newRegistration);

    return res.json({
      id,
      student_id: new_student_id,
      plan_id: new_plan_id,
      start_date: new_start_date,
      end_date,
      price,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { start_date, student_id, plan_id } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const studentAlreadyHasPlan = await Registration.findOne({
      where: { student_id },
    });

    if (studentAlreadyHasPlan) {
      return res.status(400).json({ error: 'Student already has a plan' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.price * plan.duration;

    const { id } = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(NewRegistrationMail.key, {
      student: studentExists,
      end_date,
      price,
    });

    return res.json({ id, student_id, plan_id, start_date, end_date, price });
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration does not exist' });
    }

    await registration.destroy();

    return res.sendStatus(200);
  }
}

export default new RegistrationController();
