import { env } from '@/main/config/env';
import { makeAxiosHttpClient } from '@/main/factories/http';
import { FacebookApi } from '@/infra/apis';

export const makeFacebookApi = (): FacebookApi => {
  const axiosClient = makeAxiosHttpClient();
  return new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);
};
