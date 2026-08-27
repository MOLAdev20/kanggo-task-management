import { prisma } from "../src/lib/prisma";
import { faker } from "@faker-js/faker";

async function main() {
  console.log("Processing 100 data task...");

  const tasks = Array.from({ length: 100 }).map(() => {
    const statuses = ["PENDING", "IN_PROGRESS", "DONE"] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      user_id: 1,
      title: faker.hacker.phrase(),
      description: faker.lorem.sentence(),
      status: randomStatus,
      deadline: faker.date.future(),
    };
  });

  await prisma.task.createMany({
    data: tasks,
  });

  console.log("✅ Berhasil nge-seed 100 data task untuk user_id = 1!");
}

main()
  .catch((e) => {
    console.error("❌ Error pas nge-seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
