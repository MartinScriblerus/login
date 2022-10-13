import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useSession } from "next-auth/react";
import Dashboard from './dashboard';
import { PrismaClient } from "@prisma/client";
// import { getPool } from '../lib/dbPool';

export default function Home(props) {
  console.log("ALLGOODS : ", props);
  const { data: session } = useSession()
 
  if(session){
      console.log('$$ SESSION!!@@@@@@@@@@@@@@@@@@ ', session);
  } 
    // let usersOK = await prisma.users.findMany();
  // console.log("this wrked! ", usersOK);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {
          !session
          ?
        <h1 className={styles.title}>
          Here is a <a href="https://nextjs.org">login flow</a>
        </h1>
        :
        null
        }
        <Dashboard session={session} />

      </main>

      <footer className={styles.footer}>
        {/* <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a> */}
      </footer>
    </div>
  )
}

// Fetch all posts (in /pages/index.tsx)
export async function getStaticProps() {

  const prisma = new PrismaClient()
  // const users = await prisma.users.findMany()
  // console.log("USERZZ ", users[0].user_name);
  // Creating a new record

    const user = await prisma.users.create({
      data: {
        user_name: 'userInIndex',
        email: 'emailInIndex',
        image: 'imgInIndex',
      },
    })

  const deleteUsers = await prisma.users.deleteMany({
    where: {
      email: {
        contains: 'prisma.io',
      },
    },
  })
    const allUserNames = await prisma.users.findMany({select:{user_name:true}});
    console.log("ttttttttthis: ", allUserNames);

return {
    props : {allUserNames} 
  }
}
