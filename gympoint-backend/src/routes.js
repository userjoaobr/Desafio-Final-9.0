import { Router } from 'express';

import UserController from './app/controllers/UserController';

import SessionController from './app/controllers/SessionController';

import StudentController from './app/controllers/StudentController';
import AdminMiddleware from './app/middlewares/admin';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';
import AvailableController from './app/controllers/AvailableController';

const routes = Router();

routes.get('/', (req, res) => res.send('Hello World'));

/* Users Signup */

routes.post('/users', UserController.store);

/* Sessions */
routes.post('/sessions', SessionController.store);

/* Checkins */

routes.get('/students/:studentId/checkins', CheckinController.index);
routes.post('/students/:studentId/checkins', CheckinController.store);

/* Help orders */
routes.get('/students/:studentId/help-orders', HelpOrderController.index);
routes.post('/students/:studentId/help-orders', HelpOrderController.store);

/* Private routes (need jwt) */

routes.use(AdminMiddleware);

/* Students */
routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

/* Plans */
routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

/* Registrations */
routes.get('/registrations', RegistrationController.index);
routes.get('/registrations/:id', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

/* Answer question */
routes.post('/help-orders/:helpOrderId/answer', AnswerController.store);

/*  Questions not answered yet */
routes.get('/students/help-orders/available', AvailableController.index);

export default routes;
