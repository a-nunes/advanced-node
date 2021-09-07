import { getRepository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repositories';

type LoadParams = LoadUserAccount.Input;
type LoadResult = LoadUserAccount.Output;
type SaveParams = SaveFacebookAccount.Params;
type SaveResult = SaveFacebookAccount.Result;
export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount {
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
