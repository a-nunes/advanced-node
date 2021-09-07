export interface SaveFacebookAccount {
  saveWithFacebook(params: SaveFacebookAccount.Input): Promise<SaveFacebookAccount.Output>;
}
export namespace SaveFacebookAccount {
  export type Input = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };

  export type Output = {
    id: string;
  };
}
