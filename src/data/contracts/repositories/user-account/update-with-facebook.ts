export interface UpdateUserByFacebookAccountRepository {
  updateWithFacebook(
    params: UpdateUserByFacebookAccountRepository.Params,
  ): Promise<void>;
}

export namespace UpdateUserByFacebookAccountRepository {
  export type Params = {
    id: string;
    name: string;
    facebookId: string;
  };
}
