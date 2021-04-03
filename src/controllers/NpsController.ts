import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveyUserRepository";

class NpsController {

  /**
   * Detratores => 0 ~ 6
   * Passivos => 7 ~ 8
   * Promotores => 9 ~ 10
   *
   * (promotores - detratores) / respondentes * 100
   */
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;
    console.log(survey_id)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractors = surveyUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const promoters = surveyUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const passives = surveyUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswers = surveyUsers.length;

    const nps = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(2));

    return res.status(200).json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps
    })
  }
}

export { NpsController };