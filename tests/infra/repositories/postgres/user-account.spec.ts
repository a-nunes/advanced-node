import { LoadUserAccountRepository } from '@/data/contracts/repositories';

import { IBackup, IMemoryDb, newDb } from 'pg-mem';
import {
  Column, Entity, getConnection, getRepository, PrimaryGeneratedColumn, Repository,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: number;
}

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser);
    const pgUser = await pgUserRepository.findOne({ email: params.email });
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser?.name ?? undefined,
      };
    }
  }
}

describe('UserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let db: IMemoryDb;
  let backup: IBackup;
  let email: string;

  beforeAll(async () => {
    email = 'any_email';
    db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser],
    });
    await connection.synchronize();
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
