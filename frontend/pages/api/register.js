import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export default async function postCreateUser (req, res) {
  console.log("REQ IS!!! ", typeof req.body)
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let input;

  console.log("req body is: ", req.body);
  console.log("req body username in register: ", req.body.user_name);
 
  // JSON.parse(req.body).user_name

  try {
    input = {
      user_name : req.body.user_name,
      email : req.body.email
    }
  } catch(e){
    console.log("Error while creating user");
  }
  if(!input){
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("input in register is: ", input)

  
  // let data = Object.values(input).map(i=>i)[0];
  const createdUser = await prisma.users.create({
    data: {
      user_name: req.body.user_name,
      email: req.body.email,
      // email_verified: null,
      // image: null,
      // // created_at: DateTime,
      // // updated_at: DateTime,
      // subusers_array: [],

    }
  })

  console.log("created user: ", createdUser);
  if(!createdUser){
    return null;
  }

  // res.status(201).json({ error: false, msg: "created user" });
  // res.end(JSON.stringify(createdUser));
} 