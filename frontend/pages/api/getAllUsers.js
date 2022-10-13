import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAllUsers (req, res) {
  console.log("REQ IS!!! ", typeof req.body)
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("REQ BODY: ", req.body)
//   try {
    const input = req.body.user_name;
    console.log("INPUT IS: ", input);
    const matchingUser = await prisma.users.findMany({
        where: {
          user_name: {
            contains: input,
          },
        },
      })
    if(matchingUser){
        return null;
    }
    // res.status(200).json({ message: "hello" });
  } 
