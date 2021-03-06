import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createdConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Update Project Controller', () => {
  jest.setTimeout(2000000000);
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
      `INSERT INTO ORGANIZATION_TYPES(id, name, created_at, updated_at)
      VALUES('1', 'Project Type', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO states(id, name, uf, created_at, updated_at)
      VALUES('1', 'state', 'st', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO cities(id, name, state_id, created_at, updated_at)
      VALUES('1', 'city', '1', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO ADDRESSES(id, city_id, created_at, updated_at)
      VALUES('${id}', '1', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO ORGANIZATIONS(id, name, description, cnpj, email, status, organization_type_id, address_id, created_at, updated_at)
      VALUES('${id}', 'Donation Type', 'xxxxxx', '123456', 'organization@beeheroes.com', '1', '1', '${id}', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO PROJECTS(id, name, start, status, organization_id, created_at, updated_at)
      VALUES('${id}', 'Name Project','now()', '1', '${id}', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO SUBSCRIPTIONS(id, registration_date, status, user_id, project_id, created_at, updated_at)
      VALUES('${id}', 'now()', '1', '${id}', '${id}', 'now()', 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to edit a subscription', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    const subscription = await request(app).post('/evaluations').send({
      score: 5,
      description: 'xxx',
      subscription_id: id,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const subscriptionId = JSON.parse(subscription.text).id;

    await request(app).put(`/evaluations?id=${subscriptionId}`).send({
      data: {
        score: 5,
      },
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const response = await request(app).get(`/evaluations/find/?id=${subscriptionId}`).send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.body.score).toEqual(5);
  });
});
