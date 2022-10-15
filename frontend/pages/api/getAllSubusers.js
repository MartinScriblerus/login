import { PrismaClient } from "@prisma/client";
import {getSession} from 'next-auth';
const prisma = new PrismaClient();

export default async function getAllSubusers (req, res) {
    
    console.log("Subuser REQ IS!!! ", typeof req.body)
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  console.log("REQ BODY: ", req.body)
//   try {
    const input = req.body.user_name;
    console.log("INPUT IS: ", input);

    return;
  } 
