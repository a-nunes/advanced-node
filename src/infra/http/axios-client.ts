import axios from 'axios';
import { HttpGetClient } from '@/infra/http';

type Input = HttpGetClient.Input;
export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>({ params, url }: Input): Promise<T> {
    const result = await axios.get(url, { params });
    return result.data;
  }
}
