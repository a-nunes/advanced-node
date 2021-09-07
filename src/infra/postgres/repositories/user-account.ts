import { getRepository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repositories';

type LoadInput = LoadUserAccount.Input;
type LoadOutput = LoadUserAccount.Output;
type SaveInput = SaveFacebookAccount.Input;
type SaveOutput = SaveFacebookAccount.Output;
export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount {
  async load({ email }: LoadInput): Promise<LoadOutput> {
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
  }: SaveInput): Promise<SaveOutput> {
    const pgUserRepository = getRepository(PgUser);
    if (id) {
      await pgUserRepository.update(id, { name, facebookId });
      return { id };
    }
    const account = await pgUserRepository.save({ email, name, facebookId });
    return { id: account.id };
  }
}
