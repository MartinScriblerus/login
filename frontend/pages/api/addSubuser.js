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

    let userToUpdate = await prisma.users.findMany({
        where: {
            user_name: {
                contains: req.body.user_name,
            }, 
        }
    })
    if(!userToUpdate){
        console.log("no user to update");
        return;
    }
    
    if(Object.values(userToUpdate)[0].subusers_array.indexOf(req.body.subuserName) === -1){
        Object.values(userToUpdate)[0].subusers_array.push(req.body.subuserName)  
    } 

        // res = prisma.users.findMany({
        //     where: { user_name: userToUpdate.user_name },
        //     select: {
        //         data:{subusers_array: true}},
        //     })
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
        if(typeof result !== String){
            result = result.toString();
        }
        return result; 
    }).catch(()=>{
        return null; 
    }).finally(()=>{
        
    }); 

    
} 
