// import { getPool } from '../../lib/dbPool';
// let pool = getPool();

// export default async function createUserRoute(){
//             // CREATE USER
     
//                 try {
//                   const sql = `
//                   INSERT INTO users (user_name, email, email_verified, image, subusers_array) 
//                   VALUES ($1, $2, $3, $4, $5) 
//                   RETURNING id, user_name, email, email_verified, image, subusers_array`;
//                   let result = await pool.query(sql, ["terst", 'tust', null, null, []]);
//                   console.log("Result after create user ", result);
               
//                   return result.rows[0];
//                 } catch (err) {
//                   console.log("error: ", err);
//                   return;
//                 }
              
              
//               // if(getOutput()){
//                 createUser();
//               // }
// } 