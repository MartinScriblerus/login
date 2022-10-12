import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import PostgresAdapter from "../../../lib/adapter.js";
import { PrismaClient } from "@prisma/client";
import {useState, useEffect} from 'react';

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
// console.log("what is pool: ", pool);


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
        const resultPrisma = await prisma.$queryRaw`SELECT * FROM Users`

        // CREATE USER
        async function createUser(user) {
          try {
            const sql = `
            INSERT INTO users (user_name, email, email_verified, image, subusers_array) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, user_name, email, email_verified, image, subusers_array`;
            let result = await pool.query(sql, [req.body.username, '', null, null, []]);
            console.log("Result after create user ", result);
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
            return result.rows[0];
          } catch(err) {
            console.log(err);
            return;
          }
        }
        getUserByName(req.body.username);
        // console.log("credentials: ", credentials);
        return {_id:'17',name:req.body.username,image:'helloz', email:req.body.password};

        console.log("DO WE HAVE A USER YET? ", user);
        // return user
        return {}
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
    }
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) { 
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      if(!session){
        return;
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("Check this user: ", user);
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