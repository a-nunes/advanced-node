import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { adaptExpressRouter } from '@/infra/http';
import { Controller } from '@/application/controllers';

describe('ExpressRouter', () => {
  let controller: MockProxy<Controller>;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let sut: RequestHandler;

  beforeAll(() => {
    controller = mock();
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_res_data' },
    });
    req = getMockReq({
      body: { data: 'any_req_data' },
    });
    res = getMockRes().res;
    next = getMockRes().next;
  });

  beforeEach(() => {
    sut = adaptExpressRouter(controller);
  });

  it('should call handle with correct params', async () => {
    await sut(req, res, next);

    expect(controller.handle).toHaveBeenCalledWith({ data: 'any_req_data' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond status 200 and valid data', async () => {
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ data: 'any_res_data' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should respond error status code and error message', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error'),
    });

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
