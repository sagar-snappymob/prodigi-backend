const { PrismaClient } = require('@prisma/client');
const { users, products } = require('./mockData');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking the dababase ...');
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('Start seeding ...');
    const userList = prisma.user.createMany({ data: users });
    const productList = prisma.product.createMany({
      data: products.map((p) => ({ ...p, image: JSON.stringify(p.image) })),
    });
    await prisma.$transaction([userList, productList]);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
