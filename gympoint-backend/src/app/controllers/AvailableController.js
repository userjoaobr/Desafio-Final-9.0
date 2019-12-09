import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class AvailableController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
      attributes: ['id', 'question'],
      include: [{ model: Student, as: 'student', attributes: ['name'] }],
    });

    return res.json(helpOrders);
  }
}

export default new AvailableController();
