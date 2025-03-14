import express, { json } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(
    JSON.stringify(
      users.map((user) => ({
        ...user,
        user_id: user.user_id.toString(),
      }))
    )
  );
});

app.listen(5000, () => console.log("Working Fine"));
