export interface CreateUserByFacebookAccountRepository {
  createFromFacebook(
    params: CreateUserByFacebookAccountRepository.Params,
  ): Promise<void>;
}

export namespace CreateUserByFacebookAccountRepository {
  export type Params = {
    email: string;
    name: string;
    facebookId: string;
  };
}
