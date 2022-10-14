import { PrismaClient } from "@prisma/client";
import {getSession} from 'next-auth';
const prisma = new PrismaClient();

export default async function getAllSubusers (req, res) {
    
    console.log("Subuser REQ IS!!! ", typeof req.body)
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("REQ BODY: ", req.body)
//   try {
    const input = req.body.user_name;
    console.log("INPUT IS: ", input);
    // const session = await getSession;
    //const allUserNames = await prisma.users.findMany({select:{subusers_array:true}});
    // console.log("whert i sesh: ", session);
    // const matchingUser = await prisma.users.upsert({
    //     select: {
    //       subusers_array: true
    //     },
    //     update: {
    //         subusers_array:['test!']
    //     },
    //     create: {
    //         subusers_array:['test2!']
    //     },
    //     where: {
    //         id:session.data.user.id
    //     }
    //   });
    //   console.log("HERE IS A MATCHING USER!!! ", matchingUser);
    
    // // if(matchingUser){
    // //     return null;
    // // }
    // res.status(200).json( matchingUser );
    return;
  } 
