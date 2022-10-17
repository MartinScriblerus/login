import { PrismaClient } from "@prisma/client";
import {getSession} from "next-auth/react";
import { resolve } from "path";
;
const prisma = new PrismaClient();


export default async function postAddSubuser (req, res) {

    console.log("REQ IS!!! ", req.body)
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    console.log("what is body of request: ", req.body);
    // let userToUpdate = await prisma.users.findMany({
    //     where: {
    //         user_name: {
    //             contains: req.body.user_name,
    //         }, 
    //     }
    // })
    // console.log("user to update: ", userToUpdate);



    ///////////
    async function getUserByName(user_name){
    
        const result = await prisma.users.findMany({
          where: {
              user_name: user_name
            },
        })

        console.log("resultttt ", result);

        let user = {
          name: result[0].user_name,
          email: result[0].email,
          image: "",
        }

        return user;
        }

        let userToUpdate= getUserByName(req.body.user_name);
        


    ///////////
    if(!userToUpdate){
        console.log("no user to update");
        return null;
    }
    console.log("this? ", Object.values(userToUpdate)[0].subusers_array);
    if(Object.values(userToUpdate)[0].subusers_array.indexOf(req.body.subuserName) === -1){
        console.log("pushing subuser name: ", req.body.subuserName);
        Object.values(userToUpdate)[0].subusers_array.push(req.body.subuserName)  
    } 

        // res = prisma.users.findMany({
        //     where: { user_name: userToUpdate.user_name },
        //     select: {
        //         data:{subusers_array: true}},
        //     })

        console.log("about to update with: ", Object.values(userToUpdate)[0].subusers_array);
    
    prisma.users.update({
        data: {
            subusers_array: {
                set: Object.values(userToUpdate)[0].subusers_array
            },
        },
        where: { id : Object.values(userToUpdate)[0].id},
    }).then(result => {
        console.log("RES in ADD ", result)
        // return result;
        // if(typeof result !== String){
        //     result = result.toString();
        // }
        // res.end(result);
        return result; 
    })

    return;
} 
