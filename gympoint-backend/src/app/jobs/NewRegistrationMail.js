import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class NewRegistrationMail {
  get key() {
    return 'NewRegistrationMail';
  }

  async handle({ data }) {
    const { student, end_date, price } = data;
    /**
     * Plano, data de término, valor e boas vindas
     */

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula realizada com sucesso!',
      template: 'new-registration-mail',
      context: {
        user: student.name,
        end_date: format(
          parseISO(end_date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        price,
      },
    });
  }
}

export default new NewRegistrationMail();
