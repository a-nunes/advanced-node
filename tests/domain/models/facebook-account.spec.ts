import { FacebookAccount } from '@/domain/models';

describe('FacebookAccount', () => {
  const fbData = {
    facebookId: 'any_fb_id',
    name: 'any_fb_name',
    email: 'any_fb_email',
  };

  it('should create account only with facebook data', () => {
    const sut = new FacebookAccount(fbData);

    expect(sut).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
    });
  });

  it('should not update account name with facebook data', () => {
    const accountData = {
      id: 'any_id',
      name: 'any_name',
    };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      facebookId: 'any_fb_id',
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
    });
  });

  it('should update account name if no name is provided', () => {
    const accountData = {
      id: 'any_id',
    };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      facebookId: 'any_fb_id',
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
    });
  });
});
