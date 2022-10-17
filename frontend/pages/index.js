import Head from 'next/head';
// import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useSession } from "next-auth/react";
import Dashboard from './dashboard';
import { prisma, PrismaClient } from "@prisma/client";
// import {useState} from 'react';
import { useRouter } from 'next/router';
// import LogInOutButton from '../components/login-btn';
import LoginWrapper from './login';
import getAllUsers from './api/getAllUsers';


export default function Home(props) {

  const { data: session } = useSession();
  console.log("session in index: ", session);
  console.log("PROPS ARE USERS HERE? ", props);
  const router = useRouter()
  
  // if(session){
  //   console.log('SESSION--------------- ', session);
  // } else {
  //   console.log("no session yet");
  // }



  return (
    <div id="pageWrapper" className={styles.container}>
      <Head>
        {
        !session
        ?
        <title>Verify</title>
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
            <LoginWrapper ></LoginWrapper>
          </>
        :
          <>
            <Dashboard session={session} />
          </>
        }
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export async function getStaticProps(){
  // fetch('/api/getAllUsers').then(async response => {
  //   try {
  //   console.log("what is response? ", response);
  //    const data = await response
  //    console.log('response data from register api?', data.body)
  //  } catch(error) {
  //    console.log('Error happened here!')
  //    console.error(error)
  //  }
  // })
  let allUsers = await getAllUsers();
  return {
    props: 
    {
      allUsers: allUsers
    }
  }
}
