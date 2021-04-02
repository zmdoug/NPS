import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveyUserRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class SendMailController {

  async create(req: Request, res: Response) {
    try {

      const { email, survey_id } = req.body;

      const usersRepository = getCustomRepository(UserRepository);
      const surveysRepository = getCustomRepository(SurveyRepository);
      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

      const user = await usersRepository.findOne({ email });

      if (!user) {
        return res.status(400).json({
          error: "User does not exists",
        })
      }

      const survey = await surveysRepository.findOne({ id: survey_id });
      if (!survey) {
        return res.status(400).json({
          error: "Survey does not exists",
        });
      }

      const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")

      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
        where: { user_id: user.id, value: null },
        relations: ["user", "survey"]
      });

      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        link: `${process.env.URL_MAIL}/answers`,
        id: ""
      };

      if (surveyUserAlreadyExists) {
        variables.id = surveyUserAlreadyExists.id;
        await SendMailService.send(email, survey.title, variables, npsPath);
        return res.status(200).json(surveyUserAlreadyExists);
      }

      const surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id
      })

      await surveysUsersRepository.save(surveyUser);

      variables.id = surveyUser.id;

      await SendMailService.send(email, survey.title, variables, npsPath);

      return res.status(201).json(surveyUser);

    } catch (error) {
      console.log(error)
    }
  }

}

export { SendMailController };