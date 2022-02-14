const { Role } = require('@prisma/client');

module.exports = {
  products: [
    {
      title: 'Bags',
      description: 'Laptop Backpack Academy Backpack',
      brand: 'PUMA',
      type: 'Accessories',
      price: 200,
      discount: 9.99,
      image: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
    },
    {
      title: 'Apple MacBook Air Laptop',
      description: 'The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power.',
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
  ],
  users: [
    {
      name: 'Sagar',
      email: 'sagar@snappymob.com',
      password: '$2b$10$W13cPuAc/LNkA8WDdT.UreVjajDicD5LVkZ7jh6Zb59TST9BLFHci',
      role: Role.ADMIN,
    },
    {
      name: 'Nirbhay',
      email: 'nirbhay@snappymob.com',
      password: '$2b$10$W13cPuAc/LNkA8WDdT.UreVjajDicD5LVkZ7jh6Zb59TST9BLFHci',
      role: Role.USER,
    },
    {
      name: 'Yee ling',
      email: 'yeeling@snappymob.com',
      password: '$2b$10$W13cPuAc/LNkA8WDdT.UreVjajDicD5LVkZ7jh6Zb59TST9BLFHci',
      role: Role.USER,
    },
  ],
};
