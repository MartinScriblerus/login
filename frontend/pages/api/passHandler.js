// const bcrypt = require('bcrypt');

// export default function handler(unHashPass){
//     return bcrypyt.hash(unHashPass, 10).then(function(hash){
//         console.log("HASH@! ". hash);
//         return hash;
//     })
// }

// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// export async function handler(){
//     bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(req.body.email, salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });
// }
// console.log("what is hash? ", hash);