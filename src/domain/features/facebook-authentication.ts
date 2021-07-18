export interface FacebookAuthentication {
  execute(token: string): AccessToken | AuthenticationError;
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
