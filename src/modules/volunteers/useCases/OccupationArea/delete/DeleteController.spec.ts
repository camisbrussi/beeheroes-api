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

    await connection.query(
      `INSERT INTO USER_TYPES(name, description, created_at, updated_at) 
      VALUES('Occupation Area', 'xxxxxx', 'now()', 'now()')`,
    );

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, user_type_id, status, created_at, updated_at) 
      VALUES('${id}', 'Admin', 'admin@beeheroes.com', '${password}', '1', '1', 'now()', 'now()')`,
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

    const { refresh_token } = responseToken.body;

    const occupationArea = await request(app).post('/occupationarea').send({
      name: 'Occupation Area test Delete',
    }).set({
      Authorization: `Bearer ${refresh_token}`,
    });

    const idOccupationArea = JSON.parse(occupationArea.text).id;

    const response = await request(app).delete(`/occupationarea?id=${idOccupationArea}`).send().set({
      Authorization: `Bearer ${refresh_token}`,
    });

    expect(response.status).toEqual(200);
  });

  it('should not be able to delete a occupation area in use', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { refresh_token } = responseToken.body;

    const occupationArea = await request(app).post('/occupationarea').send({
      name: 'Occupation Area test Delete',
    }).set({
      Authorization: `Bearer ${refresh_token}`,
    });

    const occupationAreaId = JSON.parse(occupationArea.text).id;

    await request(app).post('/volunteers').send({
      cpf: '0000',
      profession: 'profession',
      description: 'xxxx',
      avatar: 'xxxx',
      occupation_area_id: occupationAreaId,
      user_id: id,
    }).set({
      Authorization: `Bearer ${refresh_token}`,
    });

    const response = await request(app).delete(`/occupationarea?id=${occupationAreaId}`).send().set({
      Authorization: `Bearer ${refresh_token}`,
    });

    expect(response.status).toEqual(400);
  });
});