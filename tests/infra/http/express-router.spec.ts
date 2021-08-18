import { Controller } from '@/application/controllers';

import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';
import { getMockReq, getMockRes } from '@jest-mock/express';

class ExpressRouter {
  constructor(private readonly controller: Controller) {}

  async handle(req: Request, _res: Response): Promise<void> {
    this.controller.handle(req.body);
  }
}

describe('ExpressRouter', () => {
  it('should call handle with correct params', async () => {
    const controller = mock<Controller>();
    const req = getMockReq({
      body: {
        data: 'any_data',
      },
    });
    const { res } = getMockRes();
    const sut = new ExpressRouter(controller);

    sut.handle(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ data: 'any_data' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });
});
