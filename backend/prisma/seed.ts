import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Upsert Categories
  const categories = ['Electronics', 'Raw Materials', 'Finished Goods'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Categories seeded:', categories);

  // Upsert Warehouses
  const warehouses = [
    { name: 'Main Warehouse', location: 'Building A, Floor 1' },
    { name: 'Quarantine Area', location: 'Building B, Floor 2' },
  ];
  for (const warehouse of warehouses) {
    await prisma.warehouse.upsert({
      where: { name: warehouse.name },
      update: {},
      create: warehouse,
    });
  }
  console.log('Warehouses seeded:', warehouses.map((w) => w.name));

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });