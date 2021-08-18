import { Controller } from '@/application/controllers';

import { Request, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { getMockReq, getMockRes } from '@jest-mock/express';

class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body });
    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.data);
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.data.message);
    }
  }
}

describe('ExpressRouter', () => {
  let controller: MockProxy<Controller>;
  let req: Request;
  let res: Response;
  let sut: ExpressRouter;

  beforeAll(() => {
    controller = mock();
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: { data: 'any_res_data' },
    });
    req = getMockReq({
      body: {
        data: 'any_req_data',
      },
    });
    res = getMockRes().res;
  });

  beforeEach(() => {
    sut = new ExpressRouter(controller);
  });

  it('should call handle with correct params', async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ data: 'any_req_data' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond status 200 and valid data', async () => {
    await sut.adapt(req, res);

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

    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith('any_error');
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
