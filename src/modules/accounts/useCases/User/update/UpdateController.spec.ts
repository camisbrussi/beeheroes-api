import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createdConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Update User Controller', () => {
  const id = uuidV4();
  beforeAll(async () => {
    connection = await createdConnection();
    await connection.runMigrations();

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, status, is_volunteer, created_at, updated_at) 
      VALUES('${id}', 'Admin', 'admin@beeheroes.com', '${password}', '1' , 'true', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO states(id, name, uf, created_at, updated_at) 
      VALUES('1', 'state', 'st', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO cities(id, name, state_id, created_at, updated_at) 
      VALUES('1', 'city', '1', 'now()', 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to edit a user', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    await request(app).put('/users').send({
      data: {
        name: 'Admin - editado',
        email: 'editado@beeheroes.com',
      },
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get(`/users/find/?id=${id}`).send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.body.name).toEqual('Admin - editado');
    expect(response.body.email).toEqual('editado@beeheroes.com');
  });

  it('should be able to edit a user and add address', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'editado@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    await request(app).put('/users').send({
      data: {
        address: {
          street: 'Street Example',
          number: '123',
          complement: '123',
          district: 'District',
          cep: 12345,
          city_id: 1,
        },
      },
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app)
      .get(`/users/find/?id=${id}`).send().set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.address).not.toBeNull();
    expect(response.body.address.street).toEqual('Street Example');
  });
});
