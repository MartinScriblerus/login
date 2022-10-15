import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export default async function postCreateUser (req, res) {
  console.log("REQ IS!!! ", typeof req.body)
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if(!req.body){
    return;
  }

  console.log("REQ BODY in register: ", JSON.parse(req.body))
//   try {
  let input = {
    user_name : JSON.parse(req.body).user_name,
    email : JSON.parse(req.body).email
  }
  console.log("WTF inpuit ", input)

  // let data = Object.values(input).map(i=>i)[0];
  const createdUser = await prisma.users.create({
    data: {
      user_name: JSON.parse(req.body).user_name,
      email:JSON.parse(req.body).email,
      // email_verified: null,
      // image: null,
      // // created_at: DateTime,
      // // updated_at: DateTime,
      // subusers_array: [],

    }
  })
  
  res.status(201).json({ error: false, msg: createdUser });

} 