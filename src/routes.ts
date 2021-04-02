import { Router } from 'express';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';
import { UserController } from './controllers/UserController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.get("/surveys", surveyController.list);
router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.post("/sendmail", sendMailController.create);
router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npsController.execute);

export { router };