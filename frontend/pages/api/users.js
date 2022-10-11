// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  console.log("what is req ", req);
  console.log("what is response: ", res);
  const session = await getSession({req});
  console.log("%% HAVE WE GOT A SESSION? ", session);
  if(!session) return res.status(401).send("Unauthorized");
  
  res.status(200).json({ name: session.user })
}
