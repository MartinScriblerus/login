import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from "@prisma/client";

const crypto = require('crypto');

const prisma = new PrismaClient();

const bcrypt = require('bcrypt');

// import { getPool } from '../../../lib/dbPool';
// let pool = getPool();

// const confirmPasswordHash = (plainPassword, hashedPassword) => {
//   console.log(plainPassword)  
//   // return new Promise(resolve => {
//     //     bcrypt.compare(plainPassword, hashedPassword, function(err, res) {
//     //         resolve(res);
//     //         console.log("WHAT IS RES??? ", res)
//     //     });
//     // })
// }

export const authOptions = {
  // Configure one or more authentication providers
  session: {
    // Set to jwt in order to CredentialsProvider works properly
    strategy: 'jwt'
  },
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
        console.log("CREDS: ", credentials);
        
        console.log("req body username: ", req.body.username);
        const resultPrisma = await prisma.$queryRaw`SELECT * FROM Users`
        
        // Check whether the user_name exists in our database
        async function getUserByName(user_name){
          try {
            const sql = `select * from users where users.user_name = $1`;
            let result = await pool.query(sql, [user_name]);
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
        
        //const resultPrisma = await prisma.$queryRaw`SELECT * FROM Users`
        
        // // Check whether the user_name exists in our database
        // async function getUserByName(user_name){
        //   // try {

        const result = await prisma.users.findMany({
          where: {
              user_name: req.body.username
            },
        })

        // const user = [{
        //   id: result[0].id,
        //   user_name: result[0].user_name,
        //   email: result[0].email,
        //   image: result[0].image,
        //   created_at: result[0].created_at,
        //   updated_at: result[0].updated_at
        // }] 
        return user;
            // // return result.rows[0];
            // return user;
        // }
        // let isUserInDb = getUserByName(req.body.user_name);

        // // return isUserInDb;
        // // res.status(201).json({ error: false, msg: isUserInDb});
        // res.send(isUserInDb);
        //return req.body.username;
      }
    })
    // ...add more providers here
  ],
  // pages: {
  //   signIn: "/login",
  // },
  jwt: {
    encryption: true
  },
  // TO DO: => SSL CERTIFICATION!
  // this may be redudant or unwanted with prisma orm being used elsewhere... 
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
     // ca:[fs.readFileSync("/BaltimoreCyberTrustRoot.crt.pem", "utf8")];
    }
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) { 
//      console.log("user check: ", user);
      try{
        console.log("credentials: ", credentials);
      } catch {
        console.log("no credentials");
      }
      const signedInUser = [{
        user:user,
        email:email,
        // credentials:credentials,
      }];
      return signedInUser;
    },
    // async redirect({ url, baseUrl }) {
    //   console.log("url check ", url);
    //   console.log("baseUrl check ", baseUrl)
  
    //   //baseUrl="/"
    //   return baseUrl;
    //   // return true;
      
    // },
    async session({ session, user, token }) {
      // console.log("session check ", session)
      if(!session){
        session = crypto.randomBytes(32).toString("hex");
        return session; 
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log("Check this user: ", user);
      console.log("Check for token: ", token);
      if(token){
        return token
      } 


    }
  },
  // redirect: async (url, _baseUrl) => {
  //   if (url === '/login'){
  //     console.log("REDIRECTING!!!");
  //     return Promise.resolve(process.env.NEXTAUTH_URL);
  //   }
  //   return Promise.resolve(process.env.NEXTAUTH_URL);
  // },
  secret:process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)