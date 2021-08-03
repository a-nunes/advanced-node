import { ServerError, UnauthorizedError } from '@/application/errors';

export type HttpResponse = {
  statusCode: number,
  data: any,
};

export const badRequest = (error: Error) => ({
  statusCode: 400,
  data: error,
});

export const unauthorized = () => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});

export const serverError = (error: Error) => ({
  statusCode: 500,
  data: new ServerError(error),
});
