type FacebookData = {
  facebookId: string;
  name: string;
  email: string;
};

type AccountData = {
  id?: string;
  name?: string;
};

export class FacebookAccount {
  id?: string;
  name: string;
  email: string;
  facebookId: string;

  constructor(fbData: FacebookData, accountData?: AccountData) {
    this.id = accountData?.id;
    this.email = fbData.email;
    this.name = accountData?.name ?? fbData.name;
    this.facebookId = fbData.facebookId;
  }
}
