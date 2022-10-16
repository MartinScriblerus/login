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


  // try {
    input = {
      user_name : req.body.user_name,
      email : req.body.email
    }
  // } catch(e){
  //   console.log("Error while creating user");
  // }
  if(!input){
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("input in register is: ", input)


  async function hashPass(email){
    // try {
    let hashPass;
    
    bcrypt.hash(email, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      // return hash
      hashPass = hash;
      console.log("HASH PASS: ", hash);
      return hashPass;
    // let data = Object.values(input).map(i=>i)[0];
    })
    return hashPass;
  }
  console.log("what is hashpass? ", hashPass);
  const encryptedPass = await hashPass(input.email);

  var createdUser = await prisma.users.create({
    data: {
      user_name: req.body.user_name,
      // email: req.body.email,
      email: encryptedPass
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