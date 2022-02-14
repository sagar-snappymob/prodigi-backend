import request from 'supertest';
import { prisma, Role } from '../db';
import router from '../server/router';
import { products, users } from '../../prisma/mockData';
import express from 'express';
import { userService } from '../services';

let app;
let server;
let token;

describe('Check API users functionality', () => {
  beforeAll(async () => {
    const userList = prisma.user.createMany({
      data: await Promise.all(users.map(async (u) => ({ ...u, password: await userService.generateHash(u.password) }))),
    });
    const productList = prisma.product.createMany({
      data: products.map((p) => ({ ...p, image: JSON.stringify(p.image) })),
    });
    await prisma.$transaction([userList, productList]);

    app = router(express());
    server = app.listen(8020);

    request(app)
      .post('/users/login')
      .send({
        email: 'sagar@snappymob.com',
        password: 'Admin@123',
      })
      .end((err, res) => {
        token = res.body.data;
      });
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteProducts = prisma.product.deleteMany();
    const deleteWishlist = prisma.wishlist.deleteMany();
    await prisma.$transaction([deleteWishlist, deleteUsers, deleteProducts]);
    await prisma.$disconnect();
    app.removeAllListeners();
    server.close();
  });

  it('should login successfully for admin user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: 'sagar@snappymob.com',
        password: 'Admin@123',
      })
      .expect(200);
  });

  it('should create new user', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Dave',
        email: 'dave@snappymob.com',
        password: 'Admin@123',
        role: Role.USER,
      })
      .expect(200);

    expect(typeof response.body.data).toBe('number');
  });

  it('should not create a new duplicatetd user', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Dave',
        email: 'dave@snappymob.com',
        password: 'Admin@123',
        role: Role.USER,
      })
      .expect(406);

    expect(response.body).toEqual({
      error_code: 'VALIDATION_ERROR',
      message: 'a user with this email is already exist.',
    });
  });
});
