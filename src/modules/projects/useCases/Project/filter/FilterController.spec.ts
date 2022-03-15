import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createdConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Filer Project Controller', () => {
  const id = uuidV4();
  beforeAll(async () => {
    connection = await createdConnection();
    await connection.runMigrations();

    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, status, created_at, updated_at) 
      VALUES('${id}', 'Admin', 'admin@beeheroes.com', '${password}', '1' , 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO ORGANIZATION_TYPES(id, name, description, created_at, updated_at) 
      VALUES('${id}', 'Project Type', 'xxxxxx', 'now()', 'now()')`,
    );

    await connection.query(
      `INSERT INTO ORGANIZATIONS(id, name, description, cnpj, email, status, organization_type_id, created_at, updated_at) 
      VALUES('${id}', 'Project Type', 'xxxxxx', '123456', 'organization@beeheroes.com', '1', '${id}', 'now()', 'now()')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to filter a project for name', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    await request(app).post('/projects').send({
      name: 'Project Name',
      description: 'Test Project',
      start: new Date(),
      end: new Date(),
      vacancies: 2,
      organization_id: id,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    await request(app).post('/projects').send({
      name: 'Project Name',
      description: 'Test Project',
      start: new Date(),
      end: new Date(),
      vacancies: 2,
      organization_id: id,
    }).set({
      Authorization: `Bearer ${token}`,
    });
    const response = await request(app).get('/projects/filter').send({
      name: 'Project',
    }).set({
      Authorization: `Bearer ${token}`,
    });

    await request(app).get('/projects/').send().set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.body.length).toEqual(2);
  });

  it('should be able to filter a project for name and organizarion', async () => {
    const responseToken = await request(app).post('/sessions')
      .send({
        email: 'admin@beeheroes.com',
        password: 'admin',
      });

    const { token } = responseToken.body;

    const response = await request(app).get('/projects/filter').send({
      name: 'Project Name',
      organization_id: id,
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.body.length).toEqual(2);
  });
});
