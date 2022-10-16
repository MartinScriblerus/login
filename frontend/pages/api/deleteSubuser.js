import { PrismaClient } from "@prisma/client";
import {getSession} from 'next-auth';
const prisma = new PrismaClient();


export default async function deleteSubuser (req, res) {
   
    console.log("Delete Subuser REQ IS!!! ", req.body)
    if (req.method !== "POST" && req.method !== "GET" ) {
        return res.status(405).json({ message: "Method not allowed" });
    }
    // const session = await getSession();
    console.log("REQ BODY: ", req.body)
//   try {
    const input = req.body.subuserName;
    // console.log("INPUT IS: ", input);
    const allSubuserNames = await prisma.users.findMany({select:{subusers_array:true}});
    console.log("all subs? ", allSubuserNames);
    var index = allSubuserNames.indexOf(input);
    if (index !== -1) {
        allSubuserNames.splice(index, 1);
    }
    console.log("to delete: ", allSubuserNames[-1])

    let userToUpdate = await prisma.users.findMany({
        where: {
            user_name: {
                contains: req.body.user_name,
            }, 
        }
    })

    // DELETE
    const deleteUsers = await prisma.users.findMany({
        where: {
  
            subusers_array: {
                equals: input,
            }

        },
      })

      let editedArray = Object.values(userToUpdate)[0].subusers_array;
      var index = editedArray.indexOf(input);
      if (index !== -1) {
        editedArray.splice(index, 1);
      }
      console.log("to delete: ", editedArray)
    prisma.users.update({
        data: {
            subusers_array: {
                set: editedArray
            },
        },
        where: { id : Object.values(userToUpdate)[0].id},
        }).then(result => {
            console.log("RES in ADD ", result)
            return result;
            // return res
        }).catch(()=>{}).finally(()=>{}); 


    res.status(200).json({ message: "delete subuser finished" });
  } 
