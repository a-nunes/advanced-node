import { PgUserAccountRepository } from '@/infra/postgres/repositories';

export const makePgUserAccountRepository = (): PgUserAccountRepository => new PgUserAccountRepository();
