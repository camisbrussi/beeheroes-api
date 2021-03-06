import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createdConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Find Occupation Area Controller', () => {
  beforeAll(async () => {
    connection = await createdConnection();
    await connection.runMigrations();
    const id = uuidV4();

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password,  status, is_volunteer, created_at, updated_at) 
      VALUES('${id}', 'Admin', 'admin@beeheroes.com', '${password}', '1' , 'true', 'now()', 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to find a occupation area by id', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    await request(app).post('/occupationarea').send({
      id: 1,
      name: 'Occupation Area Supertest',
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get('/occupationarea/find?id=1').send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.body.id).toEqual(1);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toEqual('Occupation Area Supertest');
  });
});
