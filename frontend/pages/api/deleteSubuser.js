import { PrismaClient } from "@prisma/client";
import {getSession} from 'next-auth';
const prisma = new PrismaClient();


export default async function deleteSubuser (req, res) {
    const session = getSession();
    console.log("Delete Subuser REQ IS!!! ", typeof req.body)
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    console.log("REQ BODY: ", req.body)
//   try {
    const input = session.data.user.name;
    console.log("INPUT IS: ", input);
    // const allSubuserNames = await prisma.users.findMany({select:{subusers_array:true}});
    // var index = allSubuserNames.indexOf(input);
    // if (index !== -1) {
    //     allSubuserNames.splice(index, 1);
    // }
    // const updateUser = await prisma.users.update({
    //     where: {
    //       user_name: userToUpdate.user_name,
    //     },
    //     update: {
    //       subusers_array: allSubuserNames,
    //     },
    //   })
    // const matchingUser = await prisma.users.findMany({
    //     where: {
    //       user_name: {
    //         contains: input,
    //       },
    //     },
    //   })
    // if(matchingUser){
    //     return null;
    // }
    // res.status(200).json({ message: "hello" });
  } 
