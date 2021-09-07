export interface LoadUserAccount {
  load(params: LoadUserAccount.Input): Promise<LoadUserAccount.Output>;
}
export namespace LoadUserAccount {
  export type Input = {
    email: string;
  };

  export type Output = undefined | {
    id: string;
    name?: string;
  };
}
