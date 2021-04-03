import request from 'supertest';
import { app } from '../App';

import createConnection from '../../database';
import { getConnection } from 'typeorm';

describe("Users", () => {

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users")
      .send({
        email: "user@example.com",
        name: "User example"
      });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a user with existing mail", async () => {
    const response = await request(app).post("/users")
      .send({
        email: "user@example.com",
        name: "User example"
      });

    expect(response.status).toBe(400);
  });

});
