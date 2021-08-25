import request from 'supertest';
import { IBackup } from 'pg-mem';
import { getConnection } from 'typeorm';

import { app } from '@/main/config/app';
import { makeFakeDb } from '@/tests/infra/postgres/mocks';
import { PgUser } from '@/infra/postgres/entities';
import { UnauthorizedError } from '@/application/errors';

describe('Facebook Login Integration Test', () => {
  describe('POST /api/login/facebook', () => {
    let email: string;
    let name: string;
    let facebookId: string;
    let backup: IBackup;
    const loadUserSpy = jest.fn();

    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy }),
    }));

    beforeAll(async () => {
      email = 'any_email';
      name = 'any_name';
      facebookId = 'any_fb_id';
      const db = await makeFakeDb([PgUser]);
      backup = db.backup();
    });

    afterAll(async () => {
      await getConnection().close();
    });

    beforeEach(() => {
      backup.restore();
    });

    it('should return 200 on success', async () => {
      loadUserSpy.mockResolvedValueOnce({ name, email, facebookId });

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' });

      expect(status).toBe(200);
      expect(body).toBeDefined();
    });

    it('should return 401 on failure', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' });

      expect(status).toBe(401);
      expect(body.error).toEqual(new UnauthorizedError().message);
    });
  });
});
