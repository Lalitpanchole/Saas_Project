const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin@123', 10);
  await prisma.user.update({
    where: { email: 'admin@example.com' },
    data: { passwordHash: hash }
  });
  console.log('Password successfully reset to Admin@123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
