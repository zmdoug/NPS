import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveyUserRepository";

class AnswerController {

  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { survey } = req.query;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
    const surveyUser = await surveysUsersRepository.findOne({
      id: String(survey),
    });

    if (!surveyUser) {
      return res.status(400).json({
        error: "Survey user does not exists!"
      });
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return res.status(200).json(surveyUser);

  }
}

export { AnswerController };