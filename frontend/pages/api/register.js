import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function postCreateUser (req, res) {
  console.log("REQ IS!!! ", typeof req.body)
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("REQ BODY: ", req.body)
//   try {
    const input = req.body;
    console.log("INPUT IS: ", input);
    const savedContact = await prisma.users.create({ data: input });
    // res.status(200).json({ message: "hello" });
  } 
