import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default async function getAllUsers(req,res){
    const prisma = new PrismaClient();

    const users = await prisma.users.findMany({
        where: {
          user_name: {
            not: null
          }
        }
    })
    //console.log("users ", users);
    return users;
}


// export default function handler(req,res){
    // const prisma = new PrismaClient();
    // // const user = await prisma.user.create({
    // //     data: {
    // //       username: '',
    // //       email: '',
    // //       image: '',
    // //     },
    // //   })
    // async function getAllUsers(){
        // try {
        //     const allUsers = await prisma.users.findMany()
        //     if(!allUsers){
        //         return null;
        //     } else {
        //         return res.status(201).json(allUsers);
        //     } 
        // } catch(e){
        //     console.log("error is ", e);
        // } finally{
        //     return; 
        // }
    // }
    // getUsers();
// };
