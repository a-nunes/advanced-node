import { RequestHandler } from 'express';
import { Controller } from '@/application/controllers';

export const adaptExpressRouter = (controller: Controller): RequestHandler => async (req, res) => {
  const { statusCode, data } = await controller.handle({ ...req.body });
  const json = statusCode === 200 ? data : { error: data.message };
  res.status(statusCode).json(json);
};
