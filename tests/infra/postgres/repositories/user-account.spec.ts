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

  beforeAll(async () => {
    email = 'any_email';
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
      await pgUserRepo.save({ email });

      const account = await sut.load({ email });

      expect(account).toEqual({ id: '1' });
    });

    it('should return undefined if user does not exists', async () => {
      const account = await sut.load({ email });

      expect(account).toBeUndefined();
    });
  });
});
