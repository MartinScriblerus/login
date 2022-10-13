import { PrismaClient } from "@prisma/client";
import {getSession} from "next-auth/react";;
const prisma = new PrismaClient();


export default async function postAddSubuser (req, res) {
    
    console.log("REQ IS!!! ", req.body)
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    console.log("REQ BODY: ", req.body);
 
    let userToUpdate = await prisma.users.findMany({
            where: {
                user_name: {
                    contains: req.body.user_name,
                }, 
            },
   
        })
        if(!userToUpdate){
            // return null;
            console.log("no user to update");
            return;
        } else {
            console.log("USER TO UPDATE: ", userToUpdate);
            
        }

//   try {
    const input = req.body.user_name;
    console.log("INPUT IS: ", req.body.subuserName);
    console.log("user to updat: ", Object.values(userToUpdate)[0])

    res = prisma.users.findMany({
        where: { user_name: userToUpdate.user_name },
        select: {
          subusers_array: true,
        },
      })
      prisma.users.update({
        data: {
          subusers_array: {
            set: [req.body.subuserName],
          },
        },
        where: { id : Object.values(userToUpdate)[0].id},
      }).then(res=>console.log(res)).catch();
    // const updateUser = await prisma.users.update({
    //     where: {
    //       id:userToUpdate.id
    //     },
    //     update: {
    //       subusers_array:[req.body.subuserName],
    //     },
    //   })
    // return res;
    //  res.status(200).json(res);
    console.log("WHAT ISS RES ", res);
  } 
