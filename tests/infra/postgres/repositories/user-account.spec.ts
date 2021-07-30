import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { PgUser } from '@/infra/postgres/entities';
import { makeFakeDb } from '@/tests/infra/postgres/mocks';

import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';

describe('UserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;
  let email: string;
  let name: string;
  let facebookId: string;

  beforeAll(async () => {
    email = 'any_email';
    name = 'any_name';
    facebookId = 'any_fb_id';
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('load', () => {
    it('should call load with correct params', async () => {
      const { id } = await pgUserRepo.save({ email });

      const account = await sut.load({ email });

      expect(account).toEqual({ id });
    });

    it('should return undefined if user does not exists', async () => {
      const account = await sut.load({ email });

      expect(account).toBeUndefined();
    });
  });

  describe('saveWithFacebook', () => {
    it('should create an account if no id is provided', async () => {
      const { id } = await sut.saveWithFacebook({ email, name, facebookId });

      const account = await pgUserRepo.findOne({ email: 'any_email' });

      expect(account?.id).toBeDefined();
      expect(account?.id).toBeTruthy();
      expect(id).toEqual(account?.id);
    });

    it('should update an account if id is provided', async () => {
      const { id } = await pgUserRepo.save({ email, name });

      await sut.saveWithFacebook({
        id,
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_fb_id',
      });

      const account = await pgUserRepo.findOne({ email: 'any_email' });

      expect(account).toEqual({
        id,
        name: 'new_name',
        email: 'any_email',
        facebookId: 'new_fb_id',
      });
    });

    it('should return id of account', async () => {
      const id = await sut.saveWithFacebook({ email, name, facebookId });

      const account = await pgUserRepo.findOne({ email: 'any_email' });

      expect(id).toEqual({ id: account?.id });
    });
  });
});
