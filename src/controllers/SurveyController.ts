import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repositories/SurveyRepository";

class SurveyController {

  async create(req: Request, res: Response) {
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveyRepository);

    const survey = surveyRepository.create({ title, description });

    await surveyRepository.save(survey);

    res.status(200).json({ survey })
  }

  async list(req: Request, res: Response) {

    const surveyRepository = getCustomRepository(SurveyRepository);

    const surveys = await surveyRepository.find();

    res.status(200).json({ surveys });
  }
}

export { SurveyController };
