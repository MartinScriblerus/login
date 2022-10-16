import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const saltRounds = 10;


export default async function postCreateUser (req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let input;

  console.log("req body email is: ", req.body.email);
  console.log("req body username in register: ", req.body.user_name);
 
// bcrypt

    bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.email, salt, function(err, hash) {
        // Store hash in your password DB.

console.log("what is hash? ", hash);

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

});
});
  
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
  res.status(201).json(createdUser);
} 