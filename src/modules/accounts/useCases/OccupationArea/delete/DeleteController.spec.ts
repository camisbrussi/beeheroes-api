import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createdConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Delete Occupation Area Controller', () => {
  const id = uuidV4();
  beforeAll(async () => {
    connection = await createdConnection();
    await connection.runMigrations();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, status, is_volunteer, created_at, updated_at) 
      VALUES('${id}', 'Admin', 'admin@beeheroes.com', '${password}', '1', 'true', 'now()', 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to delete a occupation area', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    await request(app).post('/occupationarea').send({
      id: 1,
      name: 'Occupation Area test Delete',
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).delete('/occupationarea?id=1').send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toEqual(200);
  });

  it('should not be able to delete a occupation area in use', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    await request(app).post('/occupationarea').send({
      id: 2,
      name: 'Occupation Area test Delete',
    }).set({
      Authorization: `Bearer ${token}`,
    });

    await request(app).post('/volunteers').send({
      description: 'xxxx',
      occupation_area_id: 2,
      user_id: id,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).delete('/occupationarea?id=2').send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toEqual(400);
  });
});
