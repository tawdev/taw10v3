import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.faqItem.deleteMany();
  console.log('Cleared faqs');
}

main().catch(console.error).finally(() => prisma.$disconnect());
