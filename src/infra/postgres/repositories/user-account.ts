import { getRepository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;
export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepository = getRepository(PgUser);
    const pgUser = await pgUserRepository.findOne({ email });
    if (pgUser) {
      return {
        id: pgUser.id,
        name: pgUser?.name ?? undefined,
      };
    }
  }

  async saveWithFacebook({
    id, email, facebookId, name,
  }: SaveParams): Promise<SaveResult> {
    const pgUserRepository = getRepository(PgUser);
    if (id) {
      await pgUserRepository.update(id, { name, facebookId });
      return { id };
    }
    const account = await pgUserRepository.save({ email, name, facebookId });
    return { id: account.id };
  }
}
