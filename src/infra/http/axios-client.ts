import axios from 'axios';
import { HttpGetClient } from '@/infra/http';

type Params = HttpGetClient.Params;
export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>({ params, url }: Params): Promise<T> {
    const result = await axios.get(url, { params });
    return result.data;
  }
}
