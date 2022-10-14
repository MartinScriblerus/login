import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useSession } from "next-auth/react";
import Dashboard from './dashboard';
import { PrismaClient } from "@prisma/client";
import {useState} from 'react';
import { useRouter } from 'next/router';
import LogInOutButton from '../components/login-btn';
import LoginWrapper from './login';
// import { getPool } from '../lib/dbPool';

export default function Home(props) {
  console.log("ALLGOODS : ", props);
  const { data: session } = useSession();

  const [username, setUsername] = useState('');
  const router = useRouter()
  if(session){
      console.log('$$ SESSION!!@@@@@@@@@@@@@@@@@@ ', session);
  } 
    // let usersOK = await prisma.users.findMany();
  // console.log("this wrked! ", usersOK);
  return (
    <div className={styles.container}>
      <Head>
        {
        !session
        ?
        <title>Create Next App</title>
        :
        <title>Logged In</title>
        }
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {
          !session
          ?
          <>
        <h1 className={styles.title}>
          Status:  
          {
            session
            ?
            <span style={{color:"rgba(225,70,80,.9)"}}> logged in</span>
            :
            <span style={{color:"rgba(225,70,80,.9)"}}> logged out</span>
          }
        </h1>
        <LoginWrapper></LoginWrapper>
        </>
        :
        <>
 
        <Dashboard session={session} />
        </>
        }
        {/* <Dashboard session={session} /> */}

      </main>

      {/* <footer className={styles.footer}>

      </footer> */}
    </div>
  )
}

// // Fetch all posts (in /pages/index.tsx)
// export async function getStaticProps() {

//   const prisma = new PrismaClient()
//   // const users = await prisma.users.findMany()
//   // console.log("USERZZ ", users[0].user_name);
//   // Creating a new record

//     // this works to create a user 
//     // (& should also provide basic info needed to enable subusers)
//     // bring back when wrapping that part up 
//     // const user = await prisma.users.create({
//     //   data: {
//     //     user_name: 'userInIndex',
//     //     email: 'emailInIndex',
//     //     image: 'imgInIndex',
//     //   },
//     // })

//   // const deleteUsers = await prisma.users.deleteMany({
//   //   where: {
//   //     email: {
//   //       contains: 'prisma.io',
//   //     },
//   //   },
//   // })
//     // const allUserNames = await prisma.users.findMany({select:{user_name:true}});
//     // console.log("ttttttttthis: ", allUserNames);

// return {
//     props : 'msg' 
//   }
// }
