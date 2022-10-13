// import {getPool} from '../../lib/dbPool'

// export default async function createUserApi(req,res){
//     console.log("HIT THIS/..//.")
//     let pool = getPool();
//     try {
//         console.log("req nom", req.body)
//         const query = 'SELECT * FROM users'
//         const values = [req.body.content]
//       const result = await pool.query(
//           query,
//           values
//       );
//       console.log( "ttt",result );
//   } catch ( error ) {
//       console.log( error );
//   }
  
  
//   };