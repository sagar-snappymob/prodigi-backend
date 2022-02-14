import request from 'supertest';
import { prisma, Role } from '../db';
import router from '../server/router';
import { products, users } from '../../prisma/mockData';
import express from 'express';
import { userService } from '../services';

let app;
let server;
let token;

describe('Check API products functionality', () => {
  beforeAll(
    () =>
      new Promise(async (res) => {
        const userList = prisma.user.createMany({
          data: await Promise.all(
            users.map(async (u) => ({ ...u, password: await userService.generateHash(u.password) }))
          ),
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
        res(data);
      })
  );

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteProducts = prisma.product.deleteMany();
    const deleteWishlist = prisma.wishlist.deleteMany();
    await prisma.$transaction([deleteWishlist, deleteUsers, deleteProducts]);
    await prisma.$disconnect();
    app.removeAllListeners();
    server.close();
  });

  it('should get products list', async () => {
    const response = await request(app).get('/products').expect(200);
    expect(response.body).toEqual({
      data: [
        {
          id: 0,
          title: 'Bags',
          description: 'Laptop Backpack Academy Backpack',
          brand: 'PUMA',
          type: 'Accessories',
          price: 200,
          discount: 9.99,
          image: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
          visited: 0,
        },
        {
          id: 1,
          title: 'Apple MacBook Air Laptop',
          description:
            'The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power.',
          brand: 'Apple',
          type: 'Laptop',
          price: 8000,
          discount: 499.99,
          image: [
            'https://picsum.photos/200',
            'https://picsum.photos/200',
            'https://picsum.photos/200',
            'https://picsum.photos/200',
          ],
          visited: 0,
        },
      ],
      page: 1,
      totalPage: 1,
    });
  });

  it('should get product by id', async () => {
    const response = await request(app).get('/products/1').expect(200);
    expect(response.body).toEqual({
      data: {
        id: 1,
        title: 'Apple MacBook Air Laptop',
        description:
          'The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power.',
        brand: 'Apple',
        type: 'Laptop',
        price: 8000,
        discount: 499.99,
        image: [
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
        ],
      },
    });
  });

  it('should create a new product as admin user', async () => {
    const response = await request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Apple MacBook Air Laptop',
        description:
          'The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power.',
        brand: 'Apple',
        type: 'Laptop',
        price: 8000,
        discount: 499.99,
        image: [
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
          'https://picsum.photos/200',
        ],
      })
      .expect(200);
    expect(typeof response.body.data).toBe('number');
  });

  it('should update a product as admin user', async () => {
    const response = await request(app)
      .put('/products/1')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Apple MacBook Air Laptop',
      })
      .expect(200);
    expect(response.body.data).toEqual({
      id: 1,
      title: 'Apple MacBook Air Laptop',
      description:
        'The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power.',
      brand: 'Apple',
      type: 'Laptop',
      price: 8000,
      discount: 499.99,
      image: [
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
        'https://picsum.photos/200',
      ],
    });
  });

  it('should return most visited products', async () => {
    const response = await request(app).get('/products/most-viewed').expect(200);
    expect(response.body).toEqual({
      data: [
        {
          id: expect.any(Number),
          title: 'Apple MacBook Air Laptop',
          description:
            'The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power.',
          brand: 'Apple',
          type: 'Laptop',
          price: 8000,
          discount: 499.99,
          image: [
            'https://picsum.photos/200',
            'https://picsum.photos/200',
            'https://picsum.photos/200',
            'https://picsum.photos/200',
          ],
          visited: 1,
        },
        {
          id: expect.any(Number),
          title: 'Bags',
          description: 'Laptop Backpack Academy Backpack',
          brand: 'PUMA',
          type: 'Accessories',
          price: 200,
          discount: 9.99,
          image: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
          visited: 0,
        },
        {
          id: expect.any(Number),
          title: 'Apple MacBook Air Laptop',
          description:
            'The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power.',
          brand: 'Apple',
          type: 'Laptop',
          price: 8000,
          discount: 499.99,
          image: [
            'https://picsum.photos/200',
            'https://picsum.photos/200',
            'https://picsum.photos/200',
            'https://picsum.photos/200',
          ],
          visited: 0,
        },
      ],
      page: 1,
      totalPage: 1,
    });
  });
});
