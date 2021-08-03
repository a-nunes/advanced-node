import { UnauthorizedError } from '@/application/errors/http/unauthorized';

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
