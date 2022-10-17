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
        username: { label: "Username", type: "text", placeholder: "Name" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("req body username: ", req.body.username);
        console.log("CREDS: ", credentials);

        console.log("req body username: ", req.body.username);
       // const resultPrisma = await prisma.$queryRaw`SELECT * FROM Users`
       // console.log("result prisma: ", resultPrisma);
        // Check whether the user_name exists in our database
    
      
          
        async function getUserByName(user_name){
    
        const result = await prisma.users.findMany({
          where: {
              user_name: user_name
            },
        })

        console.log("resultttt ", result);

        let user = {
          name: result[0].user_name,
          email: result[0].email,
          image: "",
        }


//==========
let hashedPass = user.email;

console.log("HASHED PASS IN NEXT AUTH: ", hashedPass);

const confirmPasswordHash = (plainPassword, hashedPassword) => {
  console.log(plainPassword)  
  return new Promise(resolve => {
        bcrypt.compare(plainPassword, hashedPassword, function(err, res) {
            resolve(res);
            console.log("WHAT IS RES??? ", res)
        });
    })
}

let passCheck = confirmPasswordHash(req.body.email, hashedPass)

if(!passCheck){
  return null
} else {
  // console.log("is user in db? ", isUserInDB);
}
//==========


        return user;
      }

        let isUserInDB = getUserByName(req.body.username);
        
      
        console.log("is user in db? ", isUserInDB);
  
        return isUserInDB;
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
    //  console.log("user check: ", user);
    //   if(!user){
    //     user = {user_name:"nameTest",email:"DNA"}
    //   }
    //   return user;
    console.log("user check: ", user);
    return true
    },
    async redirect({ url, baseUrl }) {
      console.log("url check ", url);
      console.log("baseUrl check ", baseUrl)
  
      //baseUrl="/"
      return baseUrl;
      // return true;
      
    },
    async session({ session, user, token }) {
      // console.log("session check ", session)
      // if(!session){
      //   session = crypto.randomBytes(32).toString("hex");
      //   return session; 
      // }
      // return session;
      // console.log("session check ", session)
      if(!session){
        return;
      }
      return session
    },
    async jwt({ token, user, account, profile }) {

      console.log("Check for token: ", token);
      if(token){
        return token
      } 


    }
  },
  redirect: async (url, _baseUrl) => {
    if (url === '/login'){
      console.log("REDIRECTING!!!");
      return Promise.resolve(process.env.NEXTAUTH_URL);
    }
    return Promise.resolve(process.env.NEXTAUTH_URL);
  },
  secret:process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)