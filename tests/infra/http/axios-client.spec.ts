import axios from 'axios';
import { AxiosHttpClient } from '@/infra/http';

jest.mock('axios');

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient;
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: object;

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data',
    });
    url = 'any_url';
    params = { data: 'any_data' };
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  describe('get', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, params });

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should return data on success', async () => {
      const result = await sut.get({ url, params });

      expect(result).toBe('any_data');
    });

    it('should rethrows if axios throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('axios_error'));

      const result = sut.get({ url, params });

      await expect(result).rejects.toThrow(new Error('axios_error'));
    });
  });
});
