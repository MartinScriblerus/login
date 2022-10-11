import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import PostgresAdapter from "../../../lib/adapter.js";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
// automatically set cookies to preserve session
// option #1 jwt
// option #2 database sessions
const prisma = new PrismaClient();

let userAccount = null;

const bcrypt = require('bcrypt');

// const confirmPasswordHash = (plainPassword, hashedPassword) => {
//   console.log(plainPassword)  
//   // return new Promise(resolve => {
//     //     bcrypt.compare(plainPassword, hashedPassword, function(err, res) {
//     //         resolve(res);
//     //         console.log("WHAT IS RES??? ", res)
//     //     });
//     // })
// }


import { Pool } from "pg";

let pool;

if (!pool) {
  pool = new Pool({
    user: process.env.AZURE_DB_USER,
    password: process.env.AZURE_DB_PASSWORD,
    host: process.env.AZURE_DB_HOST,
    port: process.env.AZURE_DB_PORT,
    database: process.env.AZURE_DB_NAME,
  });
}
console.log("what is pool: ", pool);



// pool.query('SELECT * FROM Users', (error, results) => {
//   if (error) {
//     throw error
//   }
//   console.log("IN THE DB: ", results.rows);
// })


export const authOptions = {
  // Configure one or more authentication providers
  
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',

      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("req body username: ", req.body.username);
        // let checkName = getUserByName(req.body.userName);
        // console.log("check name: ", checkName);
        // const user = credentials;
        const resultPrisma = await prisma.$queryRaw`SELECT * FROM Users`

        let user;
  
        async function createUser(user) {
          console.log("^^^^ trying to create user... ", user)
          try {
            const sql = `
            INSERT INTO users (user_name, email, email_verified, image, subusers_array) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, user_name, email, email_verified, image, subusers_array`;
            let result = await pool.query(sql, [req.body.username, '', null, null, []]);
            console.log("^^ Result after create user ", result);
                    return result.rows[0];
          } catch (err) {
            console.log("error: ", err);
            return;
          }
        }
        createUser();
        
        async function getUserByName(user_name){
          try {
              const sql = `select * from users where users.user_name = $1`;
              let result = await pool.query(sql, [user_name]);
              console.log("found this user in database: ", result);
              user = result.rows[0]
              return result.rows[0];
          } catch(err) {
      console.log(err);
      return;
          }
      }
      getUserByName(req.body.username);


        // console.log("COULD IT BE??? ", resultPrisma);
        // console.log("CHECK??? ", resultPrisma.map(i=>i.user_name));
        // if(resultPrisma.map(i=>i.user_name === req.body.username)){
        //   console.log("IN THE DB!!! ", req.body.username);
        // } else {
        //   console.log("name not in the database");
        // }

        // if (user) {
        //   console.log("here is the user: ", user);
        //   // Any object returned will be saved in `user` property of the JWT
        //   return user
        // } else {
        //   console.log("returning null in nextauth");
        //   // If you return null or false then the credentials will be rejected
        //   return null
        //   // You can also Reject this callback with an Error or with a URL:
        //   // throw new Error('error message') // Redirect to error page
        //   // throw '/path/to/redirect'        // Redirect to a URL
        // }
        console.log("DO WE HAVE A USER YET? ", user);
        return user
      }
    })
    // ...add more providers here
  ],
  jwt: {
    encryption: true
  },
  secret: process.env.NEXTAUTH_SECRET,

  
  // adapter: PostgresAdapter(pool),

  // TO DO: => SSL CERTIFICATION!
  database: {
    type: "postgres",
    host: process.env.AZURE_DB_HOST,
    port: process.env.AZURE_DB_PORT,
    username: process.env.AZURE_DB_USER,
    password: process.env.AZURE_DB_PASSWORD,
    database: process.env.AZURE_DB_NAME,
    synchronize:true,
    ssl: {
      rejectUnauthorized:false,
      //ca: fs.readFileSync("ca.-certificate.crt").toString()
    }
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      
      // console.log(`signInData=> user: ${Object.values(user)}, account: ${account}, profile: ${profile}, email: ${email}, credentials: ${credentials}`);
      
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
     // console.log(`session=> session: ${session}, user: ${user}, token: ${token}`);
      if(!session){
        return;
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
        console.log("HEEEEYYYYYYY A USER!!!: ", user);
     // console.log(`jwt=> token: ${token}, user: ${user}, account: ${account}, profile: ${profile},is new: ${isNewUser}`);
      return token
    }
  },
  // redirect: async (url, _baseUrl) => {
  //   if (url === '/login'){
  //     console.log("REDIRECTING!!!");
  //     return Promise.reolve('/');
  //   }
  //   return Promise.resolve('/');
  // }
}

export default NextAuth(authOptions)