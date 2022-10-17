import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function handler(){
    const prisma = new PrismaClient();
    // const user = await prisma.user.create({
    //     data: {
    //       username: '',
    //       email: '',
    //       image: '',
    //     },
    //   })
    async function getUsers(){
        let allUsers = await prisma.$queryRaw`SELECT * FROM Users`;
        if(!allUsers){
        return null;
        }
        res.status(201).json(allUsers);
    }
    getUsers()
};
