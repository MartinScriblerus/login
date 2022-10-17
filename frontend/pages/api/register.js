import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const saltRounds = 10;


export default async function postCreateUser (req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

// bcrypt
  let input = {
    user_name : req.body.user_name,
    email : req.body.email
  }

  if(!input){
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("input in register is: ", input)

  async function createUser(user, hash){
    var createdUser = await prisma.users.create({
      data: {
        user_name: user,
        // email: req.body.email,
        email: hash
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

  bcrypt.hash(input.email, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    createUser(req.body.user_name, hash)
  });

} 