export interface FacebookAuthentication {
  execute(params: FacebookAuthentication.Params): FacebookAuthentication.Result;
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string;
  };

  export type Result = AccessToken | AuthenticationError;
}

type AccessToken = {
  accessToken: string;
};

class AuthenticationError extends Error {
  constructor() {
    super('Authentication Failed.');
    this.name = 'AuthenticationError';
  }
}
