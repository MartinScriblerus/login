import { fstat } from "fs"
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import PostgresAdapter from "../../../lib/adapter.js";
// automatically set cookies to preserve session
// option #1 jwt
// option #2 database sessions

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
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    
    // ...add more providers here
  ],
  adapter: PostgresAdapter(pool),
  // TO DO: => SSL CERTIFICATION!
  // database: {
  //   type: "postgres",
  //   host: process.env.AZURE_DB_HOST,
  //   port: process.env.AZURE_DB_PORT,
  //   username: process.env.AZURE_DB_USER,
  //   password: process.env.AZURE_DB_PASSWORD,
  //   database: process.env.AZURE_DB_NAME,
  //   synchronize:true,
  //   // ssl: {
  //   //   rejectUnauthorized:false,
  //   //   ca: fs.readFileSync("ca.-certificate.crt").toString();
  //   // }
  // }
}

export default NextAuth(authOptions)