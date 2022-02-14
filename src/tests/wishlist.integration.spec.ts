import request from 'supertest';
import { prisma, Role } from '../db';
import router from '../server/router';
import { products, users } from '../../prisma/mockData';
import express from 'express';
import { userService } from '../services';

let app;
let token;
let server;
let wishlistId;

describe('Check API products functionality', () => {
  beforeAll(async () => {
    const userList = prisma.user.createMany({
      data: await Promise.all(users.map(async (u) => ({ ...u, password: await userService.generateHash(u.password) }))),
    });
    const productList = prisma.product.createMany({
      data: products.map((p, id) => ({ ...p, id, image: JSON.stringify(p.image) })),
    });
    await prisma.$transaction([userList, productList]);

    app = router(express());
    server = app.listen(8020);
    const {
      body: { data },
    } = await request(app).post('/users/login').send({
      email: 'sagar@snappymob.com',
      password: 'Admin@123',
    });
    token = data;
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

  it('should add a product to user wishlist', async () => {
    const response = await request(app)
      .post('/wishlist')
      .set('Authorization', 'Bearer ' + token)
      .send({
        productId: 1,
      })
      .expect(200);

    expect(response.body).toEqual({ data: true });
  });

  it('should get user wishlist', async () => {
    const response = await request(app)
      .get('/wishlist')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    wishlistId = response.body.data[0].id;
    expect(response.body).toEqual({
      data: [{ id: expect.any(Number), userId: expect.any(Number), productId: 1, product: expect.any(Object) }],
    });
  });

  it('shoulda delete a product from user wishlist', async () => {
    const response = await request(app)
      .delete(`/wishlist/${wishlistId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(response.body).toEqual({ data: { id: wishlistId, userId: expect.any(Number), productId: 1 } });
  });
});
