// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function http://localhost:3000 (req, res) {
//   console.log("REQ IS!!! ", typeof req.body)
//   try{
//     if (req.method !== "GET") {
//       return res.status(405).json({ message: "Method not allowed" });
//     }
  
//   console.log("REQ BODY: ", req.body)
// //   try {
//     const input = req.body.user_name;
//     console.log("INPUT IS: ", input);
//     const matchingUser = await prisma.users.findMany({
//         where: {
//           user_name: {
//             contains: input,
//           },
//         },
//       })
//     if(matchingUser){
//         return null;
//     }
//   } catch (e){
//     console.log(e)
//   }
//     // res.status(200).json({ message: "hello" });
//   } 
