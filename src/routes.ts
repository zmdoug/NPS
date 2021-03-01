import { Router } from 'express';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';
import { UserController } from './controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();

router.get("/surveys", surveyController.list);

router.post("/users", userController.create);
router.post("/surveys", surveyController.create);

router.post("/sendmail", sendMailController.create)

export { router };