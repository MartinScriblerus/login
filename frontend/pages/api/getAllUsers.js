import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export default function handler(req,res){
    const prisma = new PrismaClient();
    // const user = await prisma.user.create({
    //     data: {
    //       username: '',
    //       email: '',
    //       image: '',
    //     },
    //   })
    async function getUsers(){
        try {
            const allUsers = await prisma.users.findMany()
            if(!allUsers){
                return null;
            } else {
                return res.status(201).json(allUsers);
            } 
        } catch(e){
            console.log("error is ", e);
        } finally{
            return; 
        }
    }
    getUsers();
};
