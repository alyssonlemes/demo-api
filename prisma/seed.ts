import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/core/utils/password";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin Demo",
      email: "admin@demo.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      name: "Usuário Demo",
      email: "user@demo.com",
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log("Seed concluído.");
  console.log("Admin: admin@demo.com / admin123");
  console.log("User:  user@demo.com / user123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
