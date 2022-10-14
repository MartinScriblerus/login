const bcrypt = require('bcrypt');

export default function handler(unHashPass){
    return bcrypyt.hash(unHashPass, 10).then(function(hash){
        console.log("HASH@! ". hash);
        return hash;
    })
}