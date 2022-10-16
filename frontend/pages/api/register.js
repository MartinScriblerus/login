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


        // Check whether the user_name exists in our database
        async function getUserByName(){
          try {
            const sql = `select * from users where users.user_name = $1`;
            let result = await pool.query(sql, [input.user_name]);
            console.log("found this user in database: ", result);
            if(!result){
              // return null to reject entry if no record found
              return 
            }
            // return the user's info
            const user = {
              id: result.rows[0].id,
              name: result.rows[0].user_name,
              email: result.rows[0].email,
              image: result.rows[0].image,
              created_at: result.rows[0].created_at,
              updated_at: result.rows[0].updated_at
            } 
            // return result.rows[0];
            return user;
          
          } catch(err) {
            console.log(err);
            return;
          }
        }
        let isUserInDb = getUserByName(req.body.username);
        if(isUserInDb){

        } else {
          // Add Google Providers to database
        }





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
  res.end(createdUser);
} 