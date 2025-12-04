import 'dotenv/config';
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import sequelize from '../../config/db.js';

jest.setTimeout(20000);

describe('Conexión a la base de datos', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('SELECT 1+1 = 2', async () => {
    const [rows] = await sequelize.query('SELECT 1+1 AS result;');
    expect(rows[0].result).toBe(2);
  });
});
