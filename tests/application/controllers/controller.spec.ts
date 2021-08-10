import { Controller } from '@/application/controllers';
import { ServerError } from '@/application/errors';
import { HttpResponse } from '@/application/helpers';
import { ValidatorComposite } from '@/application/validation';

import { mocked } from 'ts-jest/utils';

jest.mock('@/application/validation/composite');

class ControllerStub extends Controller {
  async execute(_httpRequest: any): Promise<HttpResponse> {
    return { statusCode: 200, data: 'any_data' };
  }
}

describe('Controller', () => {
  let sut: ControllerStub;
  let data: string;

  beforeAll(() => {
    data = 'any_data';
  });

  beforeEach(() => {
    sut = new ControllerStub();
  });

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_fails');
    const ValidatorCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));
    mocked(ValidatorComposite).mockImplementationOnce(ValidatorCompositeSpy);

    const res = await sut.handle(data);

    expect(ValidatorComposite).toHaveBeenCalledWith([]);
    expect(res).toEqual({ statusCode: 400, data: error });
  });

  it('should return 500 if execute throws', async () => {
    const error = new Error('execute_error');
    jest.spyOn(sut, 'execute').mockRejectedValueOnce(error);

    const res = await sut.handle(data);

    expect(res).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
