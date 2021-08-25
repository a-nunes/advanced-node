import { v4 } from 'uuid';
import { DataType, IMemoryDb, newDb } from 'pg-mem';

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb();
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    impure: true,
    returns: DataType.uuid,
    implementation: () => v4(),
  });
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts'],
  });
  await connection.synchronize();
  return db;
};
