export interface TokenGenerator {
  generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result>;
}

export namespace TokenGenerator {
  export type Params = {
    key: string;
    expiration: number;
  };

  export type Result = string;
}
