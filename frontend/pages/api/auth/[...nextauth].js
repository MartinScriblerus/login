import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        //const resultPrisma = await prisma.$queryRaw`SELECT * FROM Users`
        
        // // Check whether the user_name exists in our database
        // async function getUserByName(user_name){
        //   // try {
 
            //let result = await prisma.$queryRaw`select * FROM users where users.user_name = @selectedName;`
            const result = await prisma.users.findMany({
              where: {
                  user_name:"99"
                },
            })
 
            console.log("DO WE GET A RESULT? ", result);
   
            const user = {
              id: result[0].id,
              user_name: result[0].user_name,
              email: result[0].email,
              image: result[0].image,
              created_at: result[0].created_at,
              updated_at: result[0].updated_at
            } 
            // return result.rows[0];
            return user;
        // }
        // let isUserInDb = getUserByName(req.body.user_name);

        // // return isUserInDb;
        // // res.status(201).json({ error: false, msg: isUserInDb});
        // res.send(isUserInDb);
      }
    })
    // ...add more providers here
  ],
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
    }
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) { 
      console.log("user check: ", user);
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log("url check ", url);
      // return baseUrl
      // return true;
      return '/https://login-24d115auh-martinscriblerus.vercel.app/'
    },
    async session({ session, user, token }) {
      console.log("session check ", session)
      // if(!session){
      //   return;
      // }
      // return session
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("Check this user: ", user);
      console.log("Check for token: ", token);
      return token
    }
  },
  redirect: async (url, _baseUrl) => {
    let public_url = process.env.PUBLIC_URL;
    if (url === public_url + '/login'){
      console.log("REDIRECTING!!!");
      return Promise.reolve(public_url);
    }
    return Promise.resolve(public_url);
  },
  secret:process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)